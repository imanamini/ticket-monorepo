import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MessageService } from '../../../../core/services/message.service';
import { NgxIcon } from '@digipay/ngx-icon';
import { ShareUploadLinkService } from '../../services/share-upload-link.service';
import { UploadLinkEnum } from '../../enums/upload-link.enum';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { ExtractIMEIService } from '../complete-info/partial/extract-imei/extract-imei.service';
import { ExtractIMEIComponent } from '../complete-info/partial/extract-imei/extract-imei.component';

@Component({
  selector: 'get-upload-media',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxButtonComponent,
    NgxIcon,
    ExtractIMEIComponent,
  ],
  templateUrl: './get-upload-media.component.html',
  styleUrl: './get-upload-media.component.scss'
})
export class GetUploadMediaComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  location = inject(Location);
  messageService = inject(MessageService);
  activatedRoute = inject(ActivatedRoute);
  extractImeiService = inject(ExtractIMEIService);

  shareUploadLinkService = inject(ShareUploadLinkService);

  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  isRecording = signal(false);
  isPaused = signal(false);
  isCameraEnabled = signal(false);
  mimeType: string = '';
  applicationFormId: string | null = null;
  detectedImei = signal<string | null>(null);
  private frameScanTimer: any = null;
  private removeTapListeners: (() => void) | null = null;
  focusRing = signal<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  ngOnInit(): void {
    this.checkMediaSupport();
    this.checkCameraPermission();
  }

  checkMediaSupport(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.messageService.showErrorMessage('دستگاه شما از ضبط تصویر پشتیبانی نمی‌کند');
      return;
    }
    this.mimeType = this.pickMimeType();
  }

  private async checkCameraPermission(): Promise<void> {
    try {
      if (navigator.permissions && (navigator.permissions as any).query) {
        const status = await (navigator.permissions as any).query({ name: 'camera' });
        if (status && status.state === 'granted') {
          await this.enableCamera();
          this.onCameraEnabled();
          return;
        }
        if (status && 'onchange' in status) {
          status.onchange = async () => {
            if (status.state === 'granted' && !this.isCameraEnabled()) {
              await this.enableCamera();
              this.onCameraEnabled();
            }
          };
        }
      }
    } catch {
      // Silently ignore and fall back to manual enable
    }
  }

  pickMimeType(): string {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4'
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }

  async enableCamera(): Promise<void> {
    try {
      const constraintsPrimary: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width:  { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 1.7777778 },
          advanced: [ ]
        },
        audio: false
      };

      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia(constraintsPrimary);
      } catch (e: any) {
        if (e && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError')) {
          const fallbackConstraints: MediaStreamConstraints = { video: true, audio: false };
          this.mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        } else {
          throw e;
        }
      }
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.isCameraEnabled.set(true);
      await this.optimizeCameraFocus();
      this.installTapToFocus();
      void this.enterFullscreen();
      this.onCameraEnabled();
    } catch (err) {
      this.handleMediaError(err);
    }
  }

  private async optimizeCameraFocus(): Promise<void> {
    try {
      if (!this.mediaStream) return;
      const [videoTrack] = this.mediaStream.getVideoTracks();
      if (!videoTrack) return;

      const capabilities: any = (videoTrack as any).getCapabilities ? (videoTrack as any).getCapabilities() : undefined;

      const constraintPayload: MediaTrackConstraints = {
        advanced: []
      } as any;

      if (capabilities?.focusMode && capabilities.focusMode.includes('continuous')) {
        (constraintPayload.advanced as any).push({ focusMode: 'continuous' } as any);
      } else if (capabilities?.focusMode && capabilities.focusMode.includes('single-shot')) {
        (constraintPayload.advanced as any).push({ focusMode: 'single-shot' } as any);
      }

      if (capabilities?.exposureMode && capabilities.exposureMode.includes('continuous')) {
        (constraintPayload.advanced as any).push({ exposureMode: 'continuous' } as any);
      }

      if (capabilities?.whiteBalanceMode && capabilities.whiteBalanceMode.includes('continuous')) {
        (constraintPayload.advanced as any).push({ whiteBalanceMode: 'continuous' } as any);
      }

      if (capabilities?.zoom && typeof capabilities.zoom.max === 'number') {
        const idealZoom = Math.min(2, capabilities.zoom.max);
        (constraintPayload.advanced as any).push({ zoom: idealZoom } as any);
      }

      // Apply only if we actually populated advanced
      if ((constraintPayload.advanced as any).length) {
        await videoTrack.applyConstraints(constraintPayload);
      }
    } catch {
      // Ignore focus optimization failures
    }
  }

  private installTapToFocus(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;
    const onTap = async (clientX: number, clientY: number) => {
      try {
        if (!this.mediaStream) return;
        const [videoTrack] = this.mediaStream.getVideoTracks();
        const rect = video.getBoundingClientRect();
        const nx = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        const ny = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);

        // Show focus ring
        this.focusRing.set({ x: clientX, y: clientY, visible: true });
        setTimeout(() => this.focusRing.set({ x: clientX, y: clientY, visible: false }), 800);

        const anyTrack: any = videoTrack as any;
        const caps = anyTrack.getCapabilities ? anyTrack.getCapabilities() : undefined;
        const advanced: any[] = [];

        if (caps?.pointsOfInterest) {
          advanced.push({ pointsOfInterest: [{ x: nx, y: ny }] } as any);
        }
        if (caps?.focusMode && caps.focusMode.includes('single-shot')) {
          advanced.push({ focusMode: 'single-shot' } as any);
        }
        if (advanced.length) {
          await videoTrack.applyConstraints({ advanced } as any);
        }
      } catch {}
    };

    const clickHandler = (e: MouseEvent) => onTap(e.clientX, e.clientY);
    const touchHandler = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      onTap(t.clientX, t.clientY);
    };

    video.addEventListener('click', clickHandler);
    video.addEventListener('touchstart', touchHandler, { passive: true });

    this.removeTapListeners = () => {
      video.removeEventListener('click', clickHandler);
      video.removeEventListener('touchstart', touchHandler as any);
    };
  }

  private onCameraEnabled(): void {
    if (!this.applicationFormId) {
      this.applicationFormId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
    }
    if (this.applicationFormId) {
      const subscription = this.shareUploadLinkService
        .getUploadLink(this.applicationFormId, UploadLinkEnum.Viewed)
        .subscribe({
          next: () => {},
          error: (err) => this.messageService.showErrorInFloki(err)
        });
      // no BaseComponent here, manually handle teardown via component destroy
      // store a reference if needed later
    }
  }

  private async enterFullscreen(): Promise<void> {
    try {
      const video = this.videoElement?.nativeElement;
      if (!video) return;
      if (document.fullscreenElement) return;
      if (video.requestFullscreen) {
        await video.requestFullscreen();
        return;
      }
      // Safari iOS inline video fullscreen
      const anyVideo: any = video as any;
      if (typeof anyVideo.webkitEnterFullscreen === 'function') {
        anyVideo.webkitEnterFullscreen();
        return;
      }
      if (anyVideo.webkitRequestFullscreen) {
        await anyVideo.webkitRequestFullscreen();
        return;
      }
      if (anyVideo.msRequestFullscreen) {
        await anyVideo.msRequestFullscreen();
        return;
      }
    } catch {
      // ignore fullscreen errors
    }
  }

  handleMediaError(err: any): void {
    console.error('Media Error:', err);
    if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
      this.messageService.showErrorMessage('لطفا دسترسی به دوربین را تایید کنید');
    } else if (err.name === 'NotFoundError') {
      this.messageService.showErrorMessage('دوربین پیدا نشد');
    } else if (err.name === 'NotReadableError') {
      this.messageService.showErrorMessage('دوربین در حال استفاده توسط برنامه دیگری است');
    } else {
      this.messageService.showErrorMessage('خطا در دسترسی به دوربین');
    }
  }

  startRecording(): void {
    if (!this.mediaStream) return;

    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStream,
        this.mimeType ? { mimeType: this.mimeType } : undefined
      );

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstart = () => {
        this.isRecording.set(true);
        this.isPaused.set(false);
        this.messageService.showSuccessMessage('ضبط ویدیو آغاز شد');
        this.startFrameScanning();
      };

      this.mediaRecorder.onpause = () => {
        this.isPaused.set(true);
       //  this.messageService.showInfoMessage('ضبط ویدیو متوقف شد');
      };

      this.mediaRecorder.onresume = () => {
        this.isPaused.set(false);
        this.messageService.showSuccessMessage('ضبط ویدیو از سر گرفته شد');
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording.set(false);
        this.isPaused.set(false);
        this.saveRecording();
        this.stopFrameScanning();
      };

      this.mediaRecorder.start(1000); // Record in 1-second chunks
    } catch (err) {
      this.messageService.showErrorMessage('خطا در شروع ضبط ویدیو');
      console.error('Recording Error:', err);
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder?.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private startFrameScanning(): void {
    if (this.frameScanTimer) {
      clearInterval(this.frameScanTimer);
    }
    this.frameScanTimer = setInterval(() => this.tryExtractImeiFromFrame(), 1000);
    // Kick off immediately once
    void this.tryExtractImeiFromFrame();
  }

  private stopFrameScanning(): void {
    if (this.frameScanTimer) {
      clearInterval(this.frameScanTimer);
      this.frameScanTimer = null;
    }
  }

  private async tryExtractImeiFromFrame(): Promise<void> {
    if (!this.videoElement?.nativeElement || this.detectedImei()) return;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (!context || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Disable smoothing to keep text/barcodes sharper for OCR
    (context as any).imageSmoothingEnabled = false;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    await new Promise<void>((resolve) => {
      canvas.toBlob(async (blob) => {
        try {
          if (!blob) return resolve();
          const file = new File([blob], 'frame.jpg', { type: 'image/jpeg' });
          const imei = await this.extractImeiService.processImage(file);
          if (imei) {
            this.detectedImei.set(imei);
            this.messageService.showSuccessMessage('IMEI شناسایی شد');
            this.stopFrameScanning();
          }
        } catch {
          // ignore OCR errors and continue scanning
        } finally {
          resolve();
        }
      }, 'image/jpeg', 0.9);
    });
  }

  onImeiSet(imei: string): void {
    this.detectedImei.set(imei);
  }

  saveRecording(): void {
    if (this.recordedChunks.length === 0) return;

    const blob = new Blob(this.recordedChunks, { type: this.mimeType || 'video/webm' });
    const url = URL.createObjectURL(blob);
    // Here you would typically upload the blob to your server
    console.log('Video blob ready for upload:', blob);
  }

  capturePhoto(): void {
    if (!this.videoElement?.nativeElement) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    if (!context || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      // Here you would typically upload the blob to your server
      console.log('Photo blob ready for upload:', blob);
    }, 'image/jpeg', 0.95);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.stopFrameScanning();
    if (this.removeTapListeners) {
      this.removeTapListeners();
      this.removeTapListeners = null;
    }
  }
}
