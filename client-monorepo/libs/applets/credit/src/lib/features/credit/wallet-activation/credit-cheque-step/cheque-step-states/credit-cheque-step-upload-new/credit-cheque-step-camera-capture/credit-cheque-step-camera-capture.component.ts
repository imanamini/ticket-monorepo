import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

const CAPTURE_RECTANGLE_HEIGHT_MARGIN = 120; //in pixels

@Component({
  selector: 'app-credit-cheque-step-camera-capture',
  templateUrl: './credit-cheque-step-camera-capture.component.html',
  styleUrls: ['./credit-cheque-step-camera-capture.component.scss'],
  imports: [NgxStatusResultModule, NgxButtonComponent, NgxTrackableIdDirective, NgxSpinnerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepCameraCaptureComponent implements OnDestroy {
  private readonly CAPTURE_WIDTH = 1155;
  private readonly CAPTURE_HEIGHT = 2240;
  private readonly ASPECT_RATIO = 165 / 320;

  loadingCamera = signal(true);
  showHint = signal<boolean>(true);
  capturing = model(true);
  capturedImage = model<string | null>(null);
  mode = input<'confirm' | 'camera'>('camera');
  context = signal<CanvasRenderingContext2D | null>(null);
  capturedFile = signal<File | null>(null);
  rectangleHeight = signal<number>(0);

  videoElement = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  canvasElement = viewChild.required<ElementRef<HTMLCanvasElement>>('canvasElement');
  captureContainer = viewChild.required<ElementRef<HTMLDivElement>>('captureContainer');
  componentArea = viewChild.required<ElementRef<HTMLDivElement>>('componentArea');

  mediaStream: MediaStream | null = null;

  capturedMode = computed(() => this.capturedImage() || this.capturedFile());
  rectangleWidth = computed(() => this.rectangleHeight() * this.ASPECT_RATIO);
  backgroundImage = computed(() => ({
    backgroundImage: this.capturedImage() ? `url(${this.capturedImage()})` : 'none',
  }));

  close = output<void>();
  confirm = output<File | null>();
  retry = output();

  #videoElement = computed(() => this.videoElement()?.nativeElement);
  #canvasElement = computed(() => this.canvasElement()?.nativeElement);
  #captureContainer = computed(() => this.captureContainer()?.nativeElement);
  #componentArea = computed(() => this.componentArea()?.nativeElement);

  private cdr = inject(ChangeDetectorRef);

  async initCamera() {
    if (this.mode() === 'confirm') {
      return;
    }
    this.showHint.set(false);
    const videoEl = this.#videoElement()!;
    const canvasEl = this.#canvasElement();

    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.controls = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: this.CAPTURE_WIDTH },
          height: { ideal: this.CAPTURE_HEIGHT },
          aspectRatio: { ideal: this.ASPECT_RATIO },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      this.mediaStream = stream;
      videoEl.srcObject = stream;

      const ctx = canvasEl.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        this.context.set(ctx);
      }

      await videoEl.play();
      this.loadingCamera.set(false);
    } catch (error) {
      console.error('Camera initialization error:', error);
    }
    this.updateRectangleSize();
  }

  takePhoto() {
    const canvas = this.#canvasElement();
    const video = this.#videoElement()!;
    const capturingArea = this.#captureContainer()!;

    const guideCssWidth = this.rectangleWidth();
    const guideCssHeight = this.rectangleHeight();

    const captureRect = capturingArea.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();

    const guideCssX = captureRect.left - videoRect.left;
    const guideCssY = captureRect.top - videoRect.top;

    const videoDisplayWidth = video.clientWidth;
    const videoDisplayHeight = video.clientHeight;
    const videoNativeWidth = video.videoWidth;
    const videoNativeHeight = video.videoHeight;

    const effectiveRect = {
      x: 0,
      y: 0,
      width: videoDisplayWidth,
      height: videoDisplayHeight,
    };

    const displayAspect = videoDisplayWidth / videoDisplayHeight;
    const nativeAspect = videoNativeWidth / videoNativeHeight;

    if (displayAspect > nativeAspect) {
      effectiveRect.height = videoDisplayWidth / nativeAspect;
      effectiveRect.y = (videoDisplayHeight - effectiveRect.height) / 2;
    } else if (displayAspect < nativeAspect) {
      effectiveRect.width = videoDisplayHeight * nativeAspect;
      effectiveRect.x = (videoDisplayWidth - effectiveRect.width) / 2;
    }

    const guideRelativeX_css = guideCssX - effectiveRect.x;
    const guideRelativeY_css = guideCssY - effectiveRect.y;

    const sx = (guideRelativeX_css / effectiveRect.width) * videoNativeWidth;
    const sy = (guideRelativeY_css / effectiveRect.height) * videoNativeHeight;
    const sWidth = (guideCssWidth / effectiveRect.width) * videoNativeWidth;
    const sHeight = (guideCssHeight / effectiveRect.height) * videoNativeHeight;

    canvas.width = this.CAPTURE_HEIGHT; // swap width and height
    canvas.height = this.CAPTURE_WIDTH;

    const ctx = this.context();
    ctx!.imageSmoothingEnabled = true;
    ctx!.imageSmoothingQuality = 'high';
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate 90 degrees counterclockwise:
    ctx!.save();
    ctx!.translate(0, canvas.height);
    ctx!.rotate(-Math.PI / 2);

    ctx!.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.height, canvas.width);
    ctx!.restore();

    this.capturing.set(false);
    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 5 * 1024 * 1024) {
          const scaleFactor = Math.sqrt((5 * 1024 * 1024) / blob.size);
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = Math.floor(canvas.width * scaleFactor);
          tempCanvas.height = Math.floor(canvas.height * scaleFactor);
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
          tempCanvas.toBlob(
            (resizedBlob) => {
              const url = URL.createObjectURL(resizedBlob as Blob);
              video.srcObject = null;
              this.capturedFile.set(new File([resizedBlob as Blob], 'cheque-image.png', { type: 'image/png' }));
              this.capturedImage.set(url);
              this.cdr.detectChanges();
              this.clearStreams();
            },
            'image/png',
            1,
          );
        } else {
          const url = URL.createObjectURL(blob as Blob);
          video.srcObject = null;
          this.capturedFile.set(new File([blob as Blob], 'cheque-image.png', { type: 'image/png' }));
          this.capturedImage.set(url);
          this.cdr.detectChanges();
          this.clearStreams();
        }
      },
      'image/png',
      0.95,
    );
  }

  updateRectangleSize() {
    const height = this.#componentArea()?.offsetHeight - CAPTURE_RECTANGLE_HEIGHT_MARGIN;
    this.rectangleHeight.set(height);
  }

  clearStreams() {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;
  }

  reCapture() {
    this.retry.emit();
    this.capturedImage.set(null);
    this.capturedFile.set(null);
    this.capturing.set(true);
    setTimeout(() => this.initCamera(), 500);
  }

  onConfirm() {
    const capturedFile = this.capturedFile();
    if (capturedFile || this.mode() === 'confirm') {
      this.confirm.emit(capturedFile);
    }
  }

  ngOnDestroy() {
    this.clearStreams();
  }
}
