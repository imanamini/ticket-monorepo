import { Injectable } from '@angular/core';
// import { BarcodeDetector as BarcodeDetectorPolyfill } from 'barcode-detector';

declare global {
  interface Window {
    BarcodeDetector: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private detector: any = null;
  private readyPromise: Promise<void>;
  private resolveReady!: () => void;
  private worker: Worker | null = null;
  private isWorkerReady = false;
  private isBusy = false; // برای جلوگیری از ارسال فریم جدید وقتی قبلی تمام نشده
  private formats = ['code_128', 'ean_13', 'ean_8'];

  constructor() {
    this.initWorker();
    // this.readyPromise = new Promise<void>((resolve) => {
    //   this.resolveReady = resolve;
    // });
    // this.initDetector();
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      // ساخت ورکر جدید
      this.worker = new Worker(new URL('./barcode-scanner.worker', import.meta.url));

      this.worker.onmessage = ({ data }) => {
        if (data.type === 'init-done') {
          this.isWorkerReady = true;
          console.log('Main: Worker is ready 🚀');
        }
      };

      // ارسال فرمان شروع به ورکر
      this.worker.postMessage({ type: 'init' });
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  detect(imageBitmap: ImageBitmap): Promise<string | null> {
    return new Promise((resolve) => {
      // 1. اگر ورکر آماده نیست یا مشغول پردازش فریم قبلی است، بیخیال شو
      if (!this.worker || !this.isWorkerReady || this.isBusy) {
        imageBitmap.close(); // حتما ببندید تا مموری لیک ندهد
        resolve(null);
        return;
      }

      this.isBusy = true;
      const msgId = Date.now(); // یک ID برای پیگیری (اختیاری)

      // هندلر دریافت نتیجه از ورکر
      const handler = (event: MessageEvent) => {
        const { type, content } = event.data;
        if (type === 'result') {
          this.worker?.removeEventListener('message', handler); // پاک کردن لیسنر
          this.isBusy = false; // آزاد شدن پرچم
          resolve(content);
        }
      };

      this.worker.addEventListener('message', handler);

      // 2. ارسال تصویر به ورکر
      // پارامتر دوم [imageBitmap] است که باعث Zero-Copy Transfer می‌شود (فوق سریع)
      this.worker.postMessage({ type: 'detect', image: imageBitmap, id: msgId }, [imageBitmap]);
    });
  }

  terminate(): void {
    this.worker?.terminate();
  }

  // private async initDetector(): Promise<void> {
  //   try {
  //     if ('BarcodeDetector' in window) {
  //       const formats = await window.BarcodeDetector.getSupportedFormats();
  //       if (formats.includes('ean_13')) {
  //         this.detector = new window.BarcodeDetector({formats: this.formats});
  //         this.resolveReady();
  //         return;
  //       }
  //     }
  //     this.detector = new BarcodeDetectorPolyfill({formats: this.formats as any[]});
  //     this.resolveReady();
  //   } catch (e) {
  //     console.error('Detector Init Error', e);
  //     this.resolveReady();
  //   }
  // }

  ready(): Promise<void> {
    return this.readyPromise;
  }

  // async detect(source: ImageBitmapSource): Promise<string | null> {
  //   if (!this.detector) {
  //     return null;
  //   }
  //   try {
  //     const results = await this.detector.detect(source);
  //     return results.length > 0 ? results[0].rawValue : null;
  //   } catch (e) {
  //     return null;
  //   }
  // }
}
