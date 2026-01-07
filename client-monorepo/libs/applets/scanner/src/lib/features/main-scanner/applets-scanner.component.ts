import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { hasWebCam } from '@client-monorepo/common/utilities';
import { BarcodeFormat } from '@zxing/library';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ScannerApiService } from '../../data-access/services/scanner-api.service';
import { ScannerPermissionDeniedComponent } from '../../components/scanner-permission-denied/scanner-permission-denied.component';
import { Router } from '@angular/router';
import { ScannerAcceptorCodeComponent } from '../../components/scanner-acceptor-code/scanner-acceptor-code.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'scanner-applet',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, PageLayoutComponent, ScannerPermissionDeniedComponent, NgxButtonComponent],
  templateUrl: './applets-scanner.component.html',
  styleUrl: './applets-scanner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletsScannerComponent implements OnInit {
  //  services
  private scannerApiService = inject(ScannerApiService);
  private router = inject(Router);
  private bottomSheetService = inject(NgxBottomSheetService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  //  signals
  isSupport = signal(false);
  scanFormats = signal([
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODABAR,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.ITF,
    BarcodeFormat.MAXICODE,
  ]);
  qrData = signal('');
  gettingBarcodeImage = signal(true);
  hasPermission = signal(false);
  isLoading = signal(true);
  processingData = signal(false);

  ngOnInit() {
    this.checkCameraAccess();
  }

  checkCameraAccess(): void {
    this.getMyQrImage();
    hasWebCam().then((hasWebcam) => {
      this.isSupport.set(hasWebcam);
    });
  }

  scanSuccessHandler(event: any): void {
    if (this.processingData()) return;
    this.processingData.set(true);
    const paramsString = event.split('?')[1];
    const params = new URLSearchParams(paramsString);
    const { action: qrAction, payload: referralCode } = {
      action: params.get('action'),
      payload: params.get('payload'),
    };
    const cellNumberParam = this.scannerApiService.getParameterByName('cellNumber', event);
    switch (parseInt(qrAction!, 10)) {
      case 1:
        this.scannerApiService
          .getUserDetail(cellNumberParam)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((result) => {
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
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((response) => {
            if (response.featureName === '400') {
              this.navigateToBill(event);
            }
            if (response.featureName === '413') {
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
            if (response.featureName === '417') {
              this.router
                .navigate(['offline-payment/old'], {
                  queryParams: { trackingCode: response.detail.trackingCode },
                })
                .then();
            }
            // dynamic invoice
            if (response.featureName === '418') {
              this.router
                .navigate(['offline-payment'], {
                  queryParams: { trackingCode: response.detail.uniqueInvoiceNumber },
                })
                .then();
            }
            // static invoice
            if (response.featureName === '419') {
              this.router
                .navigate(['offline-payment/static'], {
                  queryParams: { trackingCode: response.detail.merchantUniqueId },
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

  getMyQrImage() {
    this.scannerApiService
      .generateMyQrImage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        const blob = new Blob([<Blob>data], { type: 'image/png' });
        const fileReader = new FileReader();

        fileReader.onload = () => {
          this.qrData.set(fileReader.result as string);
          this.gettingBarcodeImage.set(false);
        };

        fileReader.readAsDataURL(blob);
      });
  }

  get avatarStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.qrData()) {
      styles['backgroundImage'] = 'url(' + this.qrData() + ')';
      styles['backgroundSize'] = 'cover';
      styles['borderWidth'] = '0';
    }

    return styles;
  }

  showMyBarcode() {
    this.isSupport.set(false);
  }

  showScanner() {
    this.isSupport.set(true);
  }

  acceptorClicked() {
    this.processingData.set(false);
    this.bottomSheetService.openBottomSheet(ScannerAcceptorCodeComponent, {});

    const bottomSheetSubscriber = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetSubscriber.unsubscribe();
    });
  }

  permissionHandler(event: boolean) {
    this.hasPermission.set(event);
    this.isLoading.set(false);
    this.cdr.detectChanges();
  }
}
