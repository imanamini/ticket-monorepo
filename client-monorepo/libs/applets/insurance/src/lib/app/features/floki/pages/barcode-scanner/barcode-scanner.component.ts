import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import { BarcodeScannerService } from './barcode-scanner.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarcodeScannerComponent implements OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('scanBox') scanBoxElement!: ElementRef<HTMLDivElement>;

  result = signal<string>('');
  hasStarted = signal<boolean>(false);
  isStarting = signal<boolean>(false);
  hasTorch = signal<boolean>(false);
  isTorchOn = signal<boolean>(false);
  hasZoom = signal<boolean>(false);
  minZoom = signal<number>(0);
  maxZoom = signal<number>(0);
  currentZoom = signal<number>(0);

  private stream: MediaStream | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private isScanning = false;
  private canvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private ctx: any = null;
  private lastScanTime = 0;
  private readonly SCAN_INTERVAL = 150; // اسکن هر 150ms (حدود 6 فریم در ثانیه)
  private rafId: number | null = null;
  private potentialCode: string | null = null;
  private reliabilityCounter = 0;
  constructor(
    private readonly scannerService: BarcodeScannerService,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef // برای مدیریت دستی آپدیت‌ها
  ) {
  }

  async start(): Promise<void> {
    if (this.isStarting()) {
      return;
    }
    this.isStarting.set(true);
    try {
      await this.scannerService.ready();
      await this.startCamera();
      this.hasStarted.set(true);
      this.startScanningLoop();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isScanning = false;
        } else if (this.hasStarted() && !this.isScanning) {
          this.startScanningLoop();
        }
      });
    } catch (err) {
      console.error('Start Error', err);
    } finally {
      this.isStarting.set(false);
      this.cdr.detectChanges();
    }
  }

  async startCamera(): Promise<void> {
    try {
      // استفاده از OffscreenCanvas برای پرفورمنس بهتر (اگر مرورگر ساپورت کند)
      if (typeof OffscreenCanvas !== 'undefined') {
        this.canvas = new OffscreenCanvas(300, 150); // سایز کوچک فقط برای ناحیه اسکن
      } else {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 150;
      }
      this.ctx = this.canvas.getContext('2d', {
        alpha: false, // آلفا نیاز نداریم (سرعت بیشتر)
        willReadFrequently: true // بهینه‌سازی مرورگر برای خواندن پیکسل‌ها
      });

      const constraints = {
        video: {
          facingMode: 'environment',
          width: {ideal: 1920}, // رزولوشن بالا برای وضوح
          height: {ideal: 1080},
          focusMode: 'continuous'
        }
      } as any;

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = this.videoElement.nativeElement;
      video.srcObject = this.stream;
      this.videoTrack = this.stream.getVideoTracks()[0];

      this.setupCameraCapabilities();

      video.onloadedmetadata = () => {
        video.play();
      };
    } catch (err) {
      console.error('Camera Access Error', err);
    }
  }

  setupCameraCapabilities(): void {
    if (!this.videoTrack) {
      return;
    }
    const capabilities = this.videoTrack.getCapabilities() as MediaTrackCapabilities;

    if ((capabilities as any).torch !== undefined) {
      this.hasTorch.set(true);
    }
    if ((capabilities as any).zoom !== undefined) {
      const zoomCap = (capabilities as any).zoom;
      const min = typeof zoomCap?.min === 'number' ? zoomCap.min : 1;
      const max = typeof zoomCap?.max === 'number' ? zoomCap.max : 5;
      this.hasZoom.set(true);
      this.minZoom.set(min);
      this.maxZoom.set(max);
      this.applyZoom(Math.min(2.0, this.maxZoom()));
    }
    // آپدیت دستی UI چون OnPush هستیم
    this.cdr.detectChanges();
  }

  startScanningLoop(): void {
    this.isScanning = true;

    // اجرای لوپ کاملا خارج از انگولار
    this.ngZone.runOutsideAngular(() => {
      const loop = (time: number) => {
        if (!this.isScanning) {
          return;
        }

        // Throttling: فقط اگر زمان کافی گذشته باشد
        if (time - this.lastScanTime > this.SCAN_INTERVAL) {
          this.lastScanTime = time;
          this.processFrame();
        }

        // استفاده از requestVideoFrameCallback اگر موجود باشد (بسیار بهینه‌تر از RAF)
        if ('requestVideoFrameCallback' in this.videoElement.nativeElement) {
          (this.videoElement.nativeElement as any).requestVideoFrameCallback(loop);
        } else {
          this.rafId = requestAnimationFrame(loop);
        }
      };
      // شروع لوپ
      if ('requestVideoFrameCallback' in this.videoElement.nativeElement) {
        (this.videoElement.nativeElement as any).requestVideoFrameCallback(loop);
      } else {
        this.rafId = requestAnimationFrame(loop);
      }
    });
  }

  async processFrame(): Promise<void> {

    const video = this.videoElement.nativeElement;

    // ابعاد ویدیوی واقعی (مثلا 1920x1080)
    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (vw === 0 || vh === 0 || !this.ctx) {
      return;
    }

    // محاسبات برش تصویر (Crop Calculation)
    // ما فرض میکنیم باکس اسکن دقیقا در مرکز صفحه است.
    // نسبت برش: مثلا 40% وسط تصویر را میخواهیم.
    const cropWidth = vw * 0.5;  // 50% عرض ویدیو
    const cropHeight = vh * 0.25; // 25% ارتفاع ویدیو (برای بارکد میله‌ای)
    const sx = (vw - cropWidth) / 2;
    const sy = (vh - cropHeight) / 2;

    // ریسایز کردن کانواس اگر سایزش با کراپ فرق دارد (یک بار انجام میشود)
    if (this.canvas.width !== cropWidth) {
      this.canvas.width = cropWidth;
      this.canvas.height = cropHeight;
    }

    // this.ctx.filter = 'grayscale(1) contrast(200%)';
    // 1. برش تصویر و رسم در کانواس کوچک (فوق العاده سریع)
    // this.ctx.drawImage(video, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    // 2. تشخیص روی تصویر کوچک شده
    // const code = await this.scannerService.detect(this.canvas);

    try {
      // این متد ناهمگام است و بسیار سریع روی GPU اجرا می‌شود
      const bitmap = await createImageBitmap(
        video,
        sx, sy, cropWidth, cropHeight // مختصات برش را همینجا می‌دهیم
      );

      // ارسال به سرویس (که به ورکر می‌فرستد)
      const code = await this.scannerService.detect(bitmap);


      if (code) {
        // if (code === this.potentialCode) {
        //   this.reliabilityCounter++;
        // } else {
        //   this.potentialCode = code;
        //   this.reliabilityCounter = 1;
        // }

        // فقط اگر ۲ بار پشت سر هم (یا ۳ بار) همین کد تایید شد، قبولش کن
        this.ngZone.run(() => {
          this.result.set(code);
          this.isScanning = false;
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
          this.cdr.detectChanges(); // آپدیت UI
        });
      } else {
        // اگر در یک فریم چیزی پیدا نشد، شمارنده را صفر کن (سخت‌گیرانه)
        // یا نکن (اگر می‌خواهی لرزش‌های لحظه‌ای را نادیده بگیری)
        this.reliabilityCounter = 0;
        this.potentialCode = null;
      }

    } catch (e) {
      console.error('Frame processing error', e);
    }

  }

  // متدهای کنترلی (Zoom, Torch, Reset) ...
  toggleTorch(): void {
    if (!this.hasTorch() || !this.videoTrack) {
      return;
    }
    this.isTorchOn.update(z => !z);
    const torchVal = this.isTorchOn();
    this.videoTrack.applyConstraints({advanced: [{torch: torchVal}]} as unknown as MediaTrackConstraints).catch(() => {
    });
    this.cdr.detectChanges();
  }

  setZoom(e: any): void {
    const v = parseFloat(e.target?.value ?? '');
    if (!isFinite(v)) {
      return;
    }
    this.applyZoom(v);
  }

  applyZoom(val: number): void {
    if (!this.videoTrack) {
      return;
    }
    const min = this.minZoom();
    const max = this.maxZoom();
    const clamped = Math.min(Math.max(val, min), max);
    this.currentZoom.set(clamped);
    this.videoTrack.applyConstraints({advanced: [{zoom: clamped}]} as unknown as MediaTrackConstraints).catch(() => {
    });
  }

  reset(): void {
    this.result.set('');
    this.startScanningLoop();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.isScanning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.stream?.getTracks().forEach(t => t.stop());
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./barcode-scanner.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
