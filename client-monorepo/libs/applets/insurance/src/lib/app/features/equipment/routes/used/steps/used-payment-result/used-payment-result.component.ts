import { AfterViewInit, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import {
  JourneyActionResultDataModel
} from '../../../../partials/journey-action-result/models/journey-action-result-data.model';
import { AsyncPipe } from '@angular/common';
import {
  JourneyActionResultComponent
} from '../../../../partials/journey-action-result/journey-action-result.component';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { PaymentResultModel } from '../../../../api/models/renewal/payment-result.model';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { ReferrerService } from '../../../../../../data-access/services/referrer.service';
import {
  GoogleTagManagerService
} from '../../../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'used-payment-result',
  templateUrl: './used-payment-result.component.html',
  standalone: true,
  imports: [AsyncPipe, JourneyActionResultComponent, JourneyButtonsComponent, UiLoadingSpinnerComponent],
  styleUrls: ['./used-payment-result.component.scss'],
})
export class UsedPaymentResultComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  journey: JourneyNamesModel;
  readonly JourneyNamesModel = JourneyNamesModel;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  // Vars
  providerId: string;
  uniqueCode: string;
  paymentResultData: PaymentResultModel;
  actionResultData: JourneyActionResultDataModel;
  orderInfo: OrderModel;
  productCategory: ProductCategoryModel;
  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly gtmService = inject(GoogleTagManagerService);

  constructor(
    private service: SharedUsedService,
    private apiService: UsedApiService,
    private intrackService: IntrackService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private referrerService: ReferrerService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.setJourney(this.journey);
    this.getProviderId();
  }

  ngAfterViewInit(): void {
    this.gtmService.pushOnDataLayer({
      event: 'page_event',
      'success-used': 1,
    });
  }

  getProviderId(): void {
    super.addSubscription(
      this.service.getProviderId().subscribe({
        next: (id) => {
          this.providerId = id;
          if (this.providerId && this.providerId !== '0') {
            this.getPaymentResult();
            this.getUniqueCode();
          } else if (this.providerId && this.providerId === '0') {
            this.getUniqueCodeFromLs();
            this.generateActionResultData(false);
          } else {
            this.getUniqueCode();
          }
        },
      }),
    );
  }

  getUniqueCode(): void {
    this.addSubscription(
      this.service.getUniqueCode().subscribe({
        next: (code) => {
          if (code && code !== this.uniqueCode) {
            this.uniqueCode = code;
            this.getOrderInfo();
          }
        },
      }),
    );
  }

  getUniqueCodeFromLs(): void {
    const code = this.service.getUniqueCodeFromLS();
    if (code !== this.uniqueCode) {
      this.uniqueCode = code;
      this.getOrderInfo();
    }
  }

  getOrderInfo(): void {
    this.loadingService.setLoading(true);
    super.addSubscription(
      this.apiService
        .getOrderInfo(this.uniqueCode)
        .pipe(tap(() => this.hasError.emit(false)))
        .subscribe({
          next: (res) => {
            this.orderInfo = res.data;
            this.productCategory = ProductCategoryModel[res.data.productCategory];
            if (res.data.paymentResultUrl) {
              this.providerId = res.data.paymentResultUrl.split('=')[1];
              this.getPaymentResult();
            }
          },
          error: (e) => {
            this.hasError.emit(true);
          },
        }),
    );
  }

  getPaymentResult(): void {
    queueMicrotask(() => {
      this.loadingService.setLoading(true);
      if (this.providerId && this.providerId !== '0') {
        super.addSubscription(
          this.apiService.paymentResult(this.providerId).subscribe({
            next: (res) => {
              this.paymentResultData = res.data;
              this.generateActionResultData(res.data.paymentSuccess);
              this.uniqueCode = this.paymentResultData.uniqueCode;
              this.service.setUniqueCode(this.uniqueCode);
              this.loadingService.setLoading(false);
              if (res.data.referer) {
                this.referrerService.setReferrerSource(res.data.referer);
              }

              this.intrackService.sendIntrackEvent('E_PRS', {paymentResult: this.paymentResultData.paymentSuccess ? 1 : 0});
            },
            error: (e) => {
              this.messageService.showErrorIfExists(e);
              this.loadingService.setLoading(false);
            },
          }),
        );
      } else {
        this.loadingService.setLoading(false);
        this.generateActionResultData(false);
      }
    });
  }

  generateActionResultData(isSucceed: boolean): void {
    this.actionResultData = {
      title: isSucceed ? 'پرداخت حق بیمه، با موفقیت انجام شد!' : 'پرداخت حق بیمه انجام نشد!',
      imageSrc: isSucceed ? 'insurance-assets/images/simple_messages.svg' : 'insurance-assets/images/renewal-failed-payment.svg',
      imageAlt: isSucceed ? 'Payment Succeed' : 'Payment Failed',
    };
    if (!isSucceed) {
      this.loadingService.setLoading(false);
    }
  }

  continueProcess(): void {
    this.intrackService.sendIntrackEvent('I_TPC', {
      DeviceModel: this.orderInfo?.productModel ?? '',
      DeviceBrand: this.orderInfo?.productBrand ?? '',
      DevicePrice: this.orderInfo?.announcedPrice ?? 0,
      TotalAmountPaid: (this.orderInfo?.taxAmount || 0) + (this.orderInfo?.payableAmount || 0),
      VoucherUsed: !!this.orderInfo?.voucherId,
      uniquecode: this.uniqueCode ?? '',
      PaymentWay: this.orderInfo?.paymentTicketTypeTitle ?? '',
    });
    const baseUrl = '/mini-app/insurance/equipment/used?code=';
    window.location.href = baseUrl + this.uniqueCode;
  }

  showPaymentSuccess(): boolean {
    return this.paymentResultData && this.paymentResultData.paymentSuccess;
  }

  showRetryBtn(): boolean {
    return (this.paymentResultData && !this.paymentResultData.paymentSuccess) || this.providerId === '0';
  }

  goToStepper(): void {
    this.intrackService.sendIntrackEvent('I_UPP', {
      DeviceModel: this.orderInfo?.productModel ?? '',
      DeviceBrand: this.orderInfo?.productBrand ?? '',
      DevicePrice: this.orderInfo?.announcedPrice ?? 0,
      uniquecode: this.uniqueCode ?? '',
      TotalAmountPaid: (this.service.getOrderInfoValue()?.taxAmount || 0) + (this.service.getOrderInfoValue()?.payableAmount || 0),
      VoucherUsed: !!this.orderInfo?.voucherId,
      PaymentWay: null,
    });

    window.location.href = INSURANCE_APP_PREFIX + '/' + `equipment/used?code=${this.uniqueCode}`;
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false);
    this.service.removeUniqueCodeFromLS();
    super.ngOnDestroy();
  }
}
