import { BarcodeData, CreditTypes, PurchaseConfirmation } from '../data-access/models/barcode.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { finalize, Subscription } from 'rxjs';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ScannerApiService } from '../data-access/services/scanner-api.service';
import { BarcodeProviderListComponent } from '../barcode-provider-list/barcode-provider-list.component';
import { BarcodeRemainingTimeComponent } from '../barcode-remaining-time/barcode-remaining-time.component';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { MessageService } from '@client-monorepo/common/utilities';
import { InquiryBarcodeComponent } from '../inquiry-barcode/inquiry-barcode.component';
import { NgxNoticeService, noticeResult } from '@digipay/ngx-notice';
import { PaymentResultComponent } from '../payment-result/payment-result.component';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeLoadingComponent } from '../barcode-loading/barcode-loading.component';
import { BarcodeLoadingService } from '../barcode-loading/service/barcode-loading.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'lib-show-barcode',
  standalone: true,
  imports: [
    CommonModule,
    NgxBarcode6Module,
    BarcodeProviderListComponent,
    DpIconComponent,
    BarcodeRemainingTimeComponent,
    NgxAppBarComponent,
    BarcodeLoadingComponent,
    NgxButtonComponent,
  ],
  templateUrl: './show-barcode.component.html',
  styleUrl: './show-barcode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowBarcodeComponent implements OnInit, OnDestroy {
  private readonly api = inject(ScannerApiService);
  private readonly notice = inject(NgxNoticeService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly barcodeLoading = inject(BarcodeLoadingService);
  private router = inject(Router);
  private activeRoute = inject(ActivatedRoute);
  providersData = signal<CreditTypes[]>([]);
  barcodeData = signal<BarcodeData | undefined>(undefined);
  creditTypesLoading = signal<boolean>(false);
  barcodeExpired = signal<boolean>(false);
  bottomSheetCloseSubscription!: Subscription;
  remainingTime = signal<number>(0);
  message = inject(MessageService);
  referrer = signal<string>('');
  @ViewChild('timer') timerComponent!: BarcodeRemainingTimeComponent;

  ngOnInit(): void {
    this.getBarcodeCreditType();
    this.handleSetBarcodeData();
  }

  private handleSetBarcodeData() {
    this.activeRoute.queryParams.subscribe((params) => {
      const hasReferrer = params['referrer'];
      if (hasReferrer) {
        this.referrer.set(hasReferrer);
      }
      const barcodeDataKeys = ['ttl', 'balance', 'creditId', 'serviceType', 'title', 'barcodeNumber'];
      const parseIntKeys = ['ttl', 'balance'];

      const barcodeData: any = {};

      if (!!Object.keys(params).length && Object.keys(params).every((i) => !!barcodeDataKeys.includes(i))) {
        Object.entries(params).forEach(([key, value]) => {
          barcodeData[key] = parseIntKeys.includes(key) ? parseInt(value) : value;
        });

        this.barcodeExpired.set(barcodeData.ttl <= new Date().getTime());
        this.barcodeData.set(barcodeData);
      }
    });
  }

  private getBarcodeCreditType() {
    this.creditTypesLoading.set(true);
    this.api
      .getBarcodeCreditType()
      .pipe(
        finalize(() => {
          this.creditTypesLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.providersData.set(response.creditTypes);
        },
      });
  }

  navigation(isCancelPayment = false) {
    this.router.navigateByUrl(this.referrer() && !isCancelPayment ? this.referrer() : 'transactions').then();
  }

  openProvidersBottomSheet(creditTypes?: CreditTypes[]) {
    if (this.shouldSkipOpeningBottomSheet()) return;

    this.openBottomSheet(creditTypes);
    this.handleBottomSheetClose();
  }

  private shouldSkipOpeningBottomSheet(): boolean {
    return !this.providersData() || this.providersData()?.length === 0;
  }

  private handleSuccessPurchase(merchantName?: string, amount?: number, barcodeNumber?: string) {
    this.bottomSheetService.openBottomSheet(InquiryBarcodeComponent, { merchantName, amount, barcodeNumber }, { disableClose: true });
    const subscription = this.bottomSheetService.onClose.subscribe(() => {
      const outputData = this.bottomSheetService.outputData();

      switch (outputData?.type) {
        case 'SUCCESS':
          this.bottomSheetService.openBottomSheet(PaymentResultComponent, outputData?.data);
          break;
        case 'CANCEL':
          this.barcodeData.set(undefined);
          this.navigation(true);
          break;
      }

      subscription.unsubscribe();
    });
  }

  private handleOfflinePurchaseNotFound() {
    this.message.showWarningMessageWithDescription({
      message: 'درخواست خرید با این بارکد یافت نشد',
      description: 'بارکد را برای اسکن به صندوقدار نشان دهید',
    });
  }

  private handleServiceTypeNotFound(merchantName?: string, creditTypes?: CreditTypes[]) {
    const creditState: 'HAS_CREDIT' | 'NO_CREDIT' = creditTypes && creditTypes.length ? 'HAS_CREDIT' : 'NO_CREDIT';

    switch (creditState) {
      case 'HAS_CREDIT':
        {
          this.notice.openModal({
            width: '362px',
            description: `فروشگاه ${merchantName} امکان خرید با روش پرداخت ${this.barcodeData()?.title} را ندارد.`,
            title: 'عدم امکان پرداخت',
            state: 'error',
            isHorizontalAction: true,
            primaryButtonLabel: 'روش جایگزین',
            secondaryButtonLabel: 'انصراف',
            position: 'bottom-center',
          });
          const afterClosedSubject = this.notice.afterClosed();
          if (afterClosedSubject) {
            const subscription = afterClosedSubject.subscribe((data: noticeResult) => {
              if (data === 'primary') {
                this.openProvidersBottomSheet(creditTypes);
              } else {
                this.message.showSuccessMessage('خرید اعتباری شما کنسل شد.');
                this.navigation(true);
              }
              subscription.unsubscribe();
            });
          }
        }
        break;
      case 'NO_CREDIT': {
        this.notice.openModal({
          description: `فروشگاه ${merchantName} امکان خرید با روش پرداخت ${this.barcodeData()?.title} را ندارد.`,
          title: 'عدم امکان پرداخت',
          state: 'error',
          brandButton: false,
          primaryButtonLabel: 'متوجه شدم',
          position: 'bottom-center',
        });
        const afterClosedSubject = this.notice.afterClosed();
        if (afterClosedSubject) {
          const subscription = afterClosedSubject.subscribe((data: noticeResult) => {
            this.navigation(true);
            subscription.unsubscribe();
          });
        }
      }
    }
  }

  private handleConfirmOrShowErrorMessage(response: PurchaseConfirmation) {
    const { status, creditTypes, error, merchantName, amount } = response;
    const isSuccess = !!~status;
    const description = isSuccess ? 'SUCCESS' : error?.description;

    switch (description) {
      case 'SUCCESS':
        this.handleSuccessPurchase(merchantName, amount, this.barcodeData()?.barcodeNumber);
        break;
      case 'OFFLINE_PURCHASE_NOT_FOUND': {
        this.handleOfflinePurchaseNotFound();
        break;
      }
      case 'SERVICE_TYPE_NOT_FOUND': {
        this.handleServiceTypeNotFound(merchantName, creditTypes);
        break;
      }
    }
  }

  private handleInquiryBarcode() {
    const barcodeNumber = this.barcodeData()?.barcodeNumber;
    if (!barcodeNumber) {
      return;
    }

    this.barcodeLoading.timerLoading(this.api.barcodePurchaseConfirmation(barcodeNumber)).subscribe({
      next: this.handleConfirmOrShowErrorMessage.bind(this),
      error: (err) => {
        this.message.showErrorOfErrorResponse(err);
      },
    });
  }

  public handlePayOrRegenerateBarcode() {
    if (!this.barcodeExpired()) {
      this.handleInquiryBarcode();
      return;
    }

    this.api.getBarcode(this.barcodeData()?.creditId ?? '').subscribe({
      next: (res) => {
        const { ttl, barcodeNumber } = res;

        this.router.navigate(['/barcode'], {
          queryParams: { ...this.barcodeData(), ttl: ttl + new Date().getTime(), barcodeNumber },
        });

        this.timerComponent.resetTimer(ttl + new Date().getTime());
      },
      error: (err) => {
        this.message.showErrorOfErrorResponse(err);
      },
    });
  }

  handleSelectCredit(data: any) {
    const {
      ttl,
      selectedCredit: { balance, creditId, serviceType, title },
      barcodeNumber,
    } = data;

    this.router.navigate(['/barcode'], {
      queryParams: { ttl, balance, creditId, serviceType, title, barcodeNumber },
    });
  }

  private openBottomSheet(creditTypes?: CreditTypes[]): void {
    this.bottomSheetService.openBottomSheet(BarcodeProviderListComponent, creditTypes ?? this.providersData(), {
      disableClose: !!creditTypes?.length || !this.barcodeData(),
    });
  }

  private handleBottomSheetClose(): void {
    this.bottomSheetCloseSubscription = this.bottomSheetService.onClose.subscribe(() => {
      this.bottomSheetCloseSubscription.unsubscribe();
      this.updateBarcodeData();
    });
  }

  private updateBarcodeData(): void {
    const outputData = this.bottomSheetService.outputData();
    if (!outputData) return;

    const {
      ttl,
      selectedCredit: { balance, creditId, serviceType, title },
      barcodeNumber,
    } = outputData;

    this.router.navigate(['/barcode'], {
      queryParams: { ttl, balance, creditId, serviceType, title, barcodeNumber },
    });

    this.bottomSheetService.closeBottomSheet();
    this.timerComponent.resetTimer(outputData.ttl);
  }

  handleBarcodeExpiration() {
    this.barcodeExpired.set(true);
  }

  ngOnDestroy(): void {
    if (this.bottomSheetCloseSubscription) this.bottomSheetCloseSubscription.unsubscribe();
  }
}
