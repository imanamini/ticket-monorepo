import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { hasWebCam } from '@client-monorepo/common/utilities';
import { BarcodeFormat } from '@zxing/library';
import { ScannerApiService } from '../../data-access/services/scanner-api.service';
import { ScannerPermissionDeniedComponent } from '../scanner-permission-denied/scanner-permission-denied.component';
import { Router } from '@angular/router';
import { ScannerAcceptorCodeComponent } from '../scanner-acceptor-code/scanner-acceptor-code.component';
import { QrErrorStatus } from '../../data-access/models/qr-detect-body-model';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'scanner-applet-scanner-qr-camera',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, ScannerPermissionDeniedComponent, NgxButtonComponent],
  templateUrl: './scanner-qr-camera.component.html',
  styleUrl: './scanner-qr-camera.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerQrCameraComponent {
  isSupport = signal(false);
  scanFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODABAR,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.ITF,
    BarcodeFormat.MAXICODE,
  ];
  gettingBarcodeImage = true;
  hasPermission = false;
  isLoading = true;
  processingData!: boolean;

  constructor(
    private scannerApiService: ScannerApiService,
    private router: Router,
    private bottomSheetService: NgxBottomSheetService,
  ) {
    this.checkCameraAccess();
  }

  checkCameraAccess(): void {
    hasWebCam().then((hasWebcam) => {
      this.isSupport.set(hasWebcam);
    });
  }

  closeScanner() {
    this.router.navigate(['']).then();
  }

  scanSuccessHandler(event: any): void {
    if (this.processingData) {
      return;
    }
    this.processingData = true;
    const paramsString = event.split('?')[1];
    const params = new URLSearchParams(paramsString);
    const { action: qrAction, payload: referralCode } = {
      action: params.get('action'),
      payload: params.get('payload'),
    };
    const cellNumberParam = this.scannerApiService.getParameterByName('cellNumber', event);
    switch (parseInt(qrAction!, 10)) {
      case 1:
        this.scannerApiService.getUserDetail(cellNumberParam).subscribe((result) => {
          sessionStorage.setItem('USER_DETAIL', JSON.stringify(result.userDetail));
          this.router
            .navigateByUrl('/cash-out/wallet-amount', {
              state: {
                userDetail: result.userDetail,
              },
            })
            .then();
        });
        break;
      default:
        this.scannerApiService
          .checkQrTypeApi({
            content: event,
            type: 0,
          })
          .subscribe((response) => {
            if (response.featureName === QrErrorStatus.BAD_REQUEST) {
              this.navigateToBill(event);
            }
            if (response.featureName === QrErrorStatus.CONTENT_TO_LARGE) {
              this.router
                .navigate(['taxi-pay'], {
                  queryParams: {
                    terminalId: response.detail.terminalId,
                    institutionId: response.detail.institutionId,
                  },
                })
                .then();
              return;
            }
            if (response.featureName === QrErrorStatus.EXPECTATION_FAILED) {
              this.router
                .navigate(['offline-payment/old'], {
                  queryParams: { trackingCode: response.detail.trackingCode },
                })
                .then();
            }
            // dynamic invoice
            if (response.featureName === QrErrorStatus.TEAPOT) {
              this.router
                .navigate(['offline-payment'], {
                  queryParams: {
                    trackingCode: response.detail.uniqueInvoiceNumber,
                  },
                })
                .then();
            }
            // static invoice
            if (response.featureName === QrErrorStatus.PAGE_EXPIRED) {
              this.router
                .navigate(['offline-payment/static'], {
                  queryParams: {
                    trackingCode: response.detail.merchantUniqueId,
                  },
                })
                .then();
            }
          });

        break;
    }
  }

  navigateToBill(scannedValue: any) {
    const bill = {
      billId: scannedValue.substr(0, 13),
      payId: scannedValue.substr(13),
    };
    if (!bill.billId || !bill.payId) {
      return;
    }
    this.router
      .navigate(['bill', 'identifier', 1], {
        queryParams: { id: bill.billId },
      })
      .then();
  }

  showMyBarcode() {
    this.isSupport.set(false);
  }

  showScanner() {
    this.isSupport.set(true);
  }

  acceptorClicked() {
    this.processingData = false;
    this.bottomSheetService.openBottomSheet(ScannerAcceptorCodeComponent, {});
  }

  permissionHandler(event: boolean) {
    if (event) {
      this.hasPermission = true;
      this.isLoading = false;
    } else {
      this.hasPermission = false;
      this.isLoading = false;
    }
  }

  scanErrorHandler(error: any): void {
    console.warn('[ScannerQrCamera] Camera error:', error);
    // Handle specific camera errors
    if (error?.name === 'NotReadableError' || error?.message?.includes('Could not start video source')) {
      console.warn('[ScannerQrCamera] Camera is in use by another app or not accessible');
      this.hasPermission = false;
      this.isLoading = false;
    } else if (error?.name === 'NotAllowedError') {
      console.warn('[ScannerQrCamera] Camera permission denied');
      this.hasPermission = false;
      this.isLoading = false;
    } else {
      // Generic error handling
      this.hasPermission = false;
      this.isLoading = false;
    }
  }

  camerasNotFoundHandler(): void {
    console.warn('[ScannerQrCamera] No cameras found on device');
    this.isSupport.set(false);
    this.isLoading = false;
  }
}
