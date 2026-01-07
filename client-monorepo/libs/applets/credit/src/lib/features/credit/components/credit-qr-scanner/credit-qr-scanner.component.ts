import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import BarcodeFormat from '@zxing/library/esm/core/BarcodeFormat';
import { BarcodeScannerData } from './models/barcode-scanner.model';
import { BarcodeScannerService } from './barcode-scanner.service';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CreditAppBarComponent } from '../credit-app-bar/credit-app-bar.component';
import { NgxScannerQrcodeComponent, NgxScannerQrcodeModule, ScannerQRCodeConfig, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { CreditPageLoadingComponent } from '../credit-page-loading/credit-page-loading.component';
// import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-credit-qr-scanner',
  templateUrl: './credit-qr-scanner.component.html',
  styleUrls: ['./credit-qr-scanner.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, ZXingScannerModule, NgxScannerQrcodeModule, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditQrScannerComponent implements OnInit, OnDestroy, AfterViewInit {
  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
        height: window.innerHeight,
        frameRate: 30,
      },
      audio: false,
    },
    isBeep: false,
  };

  lastScannedTime = 0;

  message = input<string>();

  scanFormats = input<BarcodeFormat[]>();

  scan = output<any>();

  /**
   * Should view scanner or not
   */
  visible = signal(false);

  /**
   * Data of current scan (like title)
   */
  data = signal<BarcodeScannerData | null>(null);

  /**
   * Reference to canvas element
   */
  canvasElement = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');

  action = viewChild<NgxScannerQrcodeComponent>('action');
  /**
   * Reference to wrapper element
   */
  wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');

  /**
   * Corners' thickness
   */
  cornerThickness = 4;
  /**
   * Corners' size
   */
  cornerSize = 40;
  /**
   * Window resize timeout.
   * Helps to improve performance
   */
  resizeTimeout!: NodeJS.Timeout;

  constructor(private service: BarcodeScannerService) {
    this.service.data.asObservable().subscribe((data) => {
      this.data.set(data);
      this.visible.set(!!data);
      if (this.visible()) {
        setTimeout(() => {
          this.draw();
        }, 300);
      }
    });

    // bind current context to resize callback
    this.windowResizeCallback = this.windowResizeCallback.bind(this);
  }

  /**
   * Get scan window width based on the window size
   */
  get scanWindowWidth(): number {
    let size = 260;
    if (window.matchMedia('(min-width: 300px)').matches) {
      size = 280;
    }
    if (window.matchMedia('(min-width: 320px)').matches) {
      size = 290;
    }
    if (window.matchMedia('(min-width: 400px)').matches) {
      size = 340;
    }
    if (window.matchMedia('(min-width: 500px)').matches) {
      size = 480;
    }
    return size;
  }

  /**
   * Get scan window height based on the window size
   */
  get scanWindowHeight(): number {
    let size = 260;
    if (window.matchMedia('(min-width: 300px)').matches) {
      size = 280;
    }
    if (window.matchMedia('(min-width: 320px)').matches) {
      size = 290;
    }
    if (window.matchMedia('(min-width: 400px)').matches) {
      size = 340;
    }
    if (window.matchMedia('(min-width: 500px)').matches) {
      size = 480;
    }
    return size;
  }

  ngOnInit() {
    // resize to window changes
    window.addEventListener('resize', this.windowResizeCallback);
  }

  ngAfterViewInit(): void {
    this.action()?.isReady.subscribe(() => {
      this.handle(this.action(), 'start');
    });
  }

  ngOnDestroy(): void {
    // remove the resize listener
    this.action()?.stop();
    window.removeEventListener('resize', this.windowResizeCallback);
  }

  public onEvent(e: ScannerQRCodeResult[]): void {
    this.action()?.stop();
    if (e?.length) {
      this.scanned(e[0].value);
    }
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) => /back|rear|environment/gi.test(f.label)); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start' && action) {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  /**
   * Window resize callback
   * Draw canvas again when window resize happens
   */
  windowResizeCallback() {
    // draw with small amount of delay
    // to improve performance
    clearTimeout(this.resizeTimeout!);
    this.resizeTimeout = setTimeout(() => {
      this.draw();
    }, 50);
  }

  /**
   * Callback function
   * Being called when scan is successful
   */
  scanned(event: any) {
    const now = Date.now();
    if (now - this.lastScannedTime > 1000) {
      this.lastScannedTime = now;
      this.scan.emit(event);
    }
  }

  /**
   * Close the scanner without sending a result
   */
  closeScanner() {
    this.action()?.stop();
    this.service.data.next(null);
  }

  /**
   * Set width and height of the canvas based on the wrapper size
   */
  private setCanvasWidthAndHeight() {
    if (!this.canvasElement() || !this.canvasElement()?.nativeElement) {
      return;
    }

    const canvas = this.canvasElement()?.nativeElement;
    const wrapperRect = this.wrapper()?.nativeElement.getBoundingClientRect();
    // set canvas width and height based on the wrapper size

    canvas!.width = wrapperRect?.width!;
    canvas!.height = wrapperRect?.height!;
  }

  /**
   * Draw on canvas (color, corners and line)
   */
  private draw() {
    if (!this.canvasElement() || !this.canvasElement()?.nativeElement) {
      return;
    }

    this.setCanvasWidthAndHeight();

    const canvas = this.canvasElement()?.nativeElement;
    const ctx = canvas?.getContext('2d');
    const wrapperRect = this.wrapper()?.nativeElement.getBoundingClientRect();
    // fill canvas with a transparent color (to make scanner visible, as canvas is a overlay)
    ctx!.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx?.fillRect(0, 0, canvas?.width!, canvas?.height!);
    // Clear an square in the middle of the page
    const topSpace = (wrapperRect?.height! - this.scanWindowHeight) / 2;
    const leftSpace = (wrapperRect?.width! - this.scanWindowWidth) / 2;
    ctx?.clearRect(leftSpace, topSpace, this.scanWindowWidth, this.scanWindowHeight);

    const thickness = this.cornerThickness;
    const lineSize = this.cornerSize;
    const d = thickness / 2;
    // make corners drawing rectangle
    const corners = {
      'top-left': {
        x: leftSpace - d,
        y: topSpace - d,
        w: lineSize,
        h: lineSize,
      },
      'bottom-left': {
        x: leftSpace - d,
        y: topSpace + this.scanWindowHeight - lineSize + d,
        w: lineSize,
        h: lineSize,
      },
      'top-right': {
        x: leftSpace + this.scanWindowWidth - lineSize + d,
        y: topSpace - d,
        w: lineSize,
        h: lineSize,
      },
      'bottom-right': {
        x: leftSpace + this.scanWindowWidth - lineSize + d,
        y: topSpace + this.scanWindowHeight - lineSize + d,
        w: lineSize,
        h: lineSize,
      },
    };

    ctx!.fillStyle = '#ff4071';
    this.drawCorners(ctx!, corners, thickness);
    // this.drawLine(ctx, leftSpace, topSpace);
  }

  /**
   * Draw corners for the scan window
   * Like:
   *  ___          ___
   * |                |
   *
   * |
   *  ___          ___|
   */
  private drawCorners(ctx: CanvasRenderingContext2D, bluePrint: any, thickness: number) {
    Object.keys(bluePrint).forEach((name) => {
      const rectDef = bluePrint[name] as {
        x: number;
        y: number;
        w: number;
        h: number;
      };
      ctx.fillRect(rectDef.x, rectDef.y, rectDef.w, rectDef.h);
      switch (name) {
        case 'top-left':
          ctx.clearRect(rectDef.x + thickness, rectDef.y + thickness, rectDef.w - thickness + 1, rectDef.h - thickness + 1);
          break;
        case 'top-right':
          ctx.clearRect(rectDef.x, rectDef.y + thickness, rectDef.w - thickness, rectDef.h - thickness + 1);
          break;
        case 'bottom-left':
          ctx.clearRect(rectDef.x + thickness, rectDef.y - 1, rectDef.w - thickness + 1, rectDef.h - thickness + 1);
          break;
        case 'bottom-right':
          ctx.clearRect(rectDef.x, rectDef.y - 1, rectDef.w - thickness, rectDef.h - thickness);
          break;
      }
    });
  }
}
