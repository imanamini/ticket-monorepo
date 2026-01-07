import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgIf } from '@angular/common';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { ActionButtonsComponent } from '../../../../../../../../components/action-buttons/action-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { ThirdPartyApiService } from '../../../../../../data-access/services/third-party/third-party-api.service';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { PaymentResultService } from '../../../../data-access/services/payment-result.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { EnvironmentService } from '@client-monorepo/app-core';
import { PaymentApiService } from '../../../../../../data-access/services/third-party/payment-api.service';
import { InsAlertComponent } from '../../../../../../../../components/ins-alert/ins-alert.component';
import { ReferrerService } from '../../../../../../../../data-access/services/referrer.service';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';
import { JourneyType, QueryParamKeysEnum } from '../../../../../../../home/query-param-keys.enum';
import {
  GoogleTagManagerService
} from '../../../../../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { NavigationService } from '../../../../../../../../data-access/services/navigation.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { AlertColorEnum } from '../../../../../../../../data-access/enums/alert-color.enum';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import {
  VehiclePaymentResultModel
} from '../../../../../../data-access/models/third-party/payment/vehicle-payment-result.model';
import { PaymentRequestTypeEnum } from '../../../../../../data-access/enums/payment-request-type.enum';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../../../data-access/constants/product-type-base-url.constant';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { StorageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'payment-result',
  standalone: true,
  imports: [InsIconComponent, ActionButtonsComponent, NgxTooltipDirective, NgIf, UiLoadingSpinnerComponent, InsAlertComponent],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentResultComponent extends BaseComponent implements OnInit {
  protected readonly IconEnum = IconEnum;
  protected readonly AlertColorEnum = AlertColorEnum;

  isSuccessful = signal<boolean>(true);
  orderTrackingCode = signal<string>(null);
  paymentTrackingCode = signal<string>(null);
  isHybrid = signal<boolean>(null);
  hasComeFromPriceConflict = signal<boolean>(false);

  public isLoading = signal<boolean>(true);
  private providerId: string;
  private referrer?: string;
  private journeyType?: JourneyType;

  private paymentApiService = inject(PaymentApiService);
  private thirdPartySharedService = inject(VehicleSharedService);
  private paymentResultService = inject(PaymentResultService);
  private referrerService = inject(ReferrerService);
  private intrackService = inject(IntrackService);
  private queryParamService = inject(QueryParamService);
  private thirdPartyApiService = inject(ThirdPartyApiService);
  private storeService = inject(StoreService);
  public navigationService = inject(NavigationService);
  private GTManagerService = inject(GoogleTagManagerService);
  private storageService = inject(StorageService);

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.GTManagerService.handleDuplicatePaymentResultEvent();
    this.initStoreData();
    this.getPaymentResult();
  }

  initStoreData(): void {
    this.storeService.loadAuthorizedApplicationData();
  }

  getPaymentResult(): void {
    super.addSubscription(
      this.queryParamService
        .getQueryParams([ThirdPartyKeysEnum.ProviderId, ThirdPartyKeysEnum.FormId, ThirdPartyKeysEnum.Referrer])
        .subscribe({
          next: (params) => {
            if (params[ThirdPartyKeysEnum.ProviderId]) {
              super.addSubscription(
                this.paymentApiService.getPaymentResult(params[ThirdPartyKeysEnum.ProviderId]).subscribe({
                  next: (response) => {
                    this.storeService.setFormId(response.result.applicationFormId);
                    this.isSuccessful.set(response.result.isSuccess);
                    this.orderTrackingCode.set(response.result.trackingCode);
                    this.paymentTrackingCode.set(response.result.paymentTrackingCode);
                    this.isHybrid.set(response.result.isHybrid);
                    this.hasComeFromPriceConflict.set(response.result.paymentRequestType === PaymentRequestTypeEnum.CONFLICT);
                    this.providerId = params[ThirdPartyKeysEnum.ProviderId];
                    this.referrer = response.result.referrer ?? this.referrerService.referrer ?? params[ThirdPartyKeysEnum.Referrer];
                    this.journeyType = this.referrerService.entryFunnelSource ?? (params[QueryParamKeysEnum.JourneyType] as JourneyType);
                    if (this.journeyType) {
                      this.referrerService.entryFunnelSource = this.journeyType;
                    }
                    this.sendPaymentResultGTMEvent(response.result);
                    this.intrackService.sendIntrackEvent('V_PRS', {paymentResult: response.result.isSuccess ? 1 : 0});
                    this.intrackService.sendIntrackEvent('mtpl_payment_result', {
                      status: response.result.isSuccess ? 'success' : 'failed',
                    });
                  },
                  complete: () => this.isLoading.set(false),
                }),
              );
            } else {
              const storedOrderData = this.paymentResultService.getOrderData();
              this.isSuccessful.set(false);
              if (storedOrderData) {
                this.isHybrid.set(storedOrderData.isHybrid);
                this.referrer = storedOrderData.referrer;
                this.journeyType = storedOrderData[QueryParamKeysEnum.JourneyType];
              } else {
                this.referrer = this.referrerService.referrer ?? params[ThirdPartyKeysEnum.Referrer];
                this.journeyType = this.referrerService.entryFunnelSource ?? (params[QueryParamKeysEnum.JourneyType] as JourneyType);
              }
              this.isLoading.set(false);
              if (this.journeyType) {
                this.referrerService.entryFunnelSource = this.journeyType;
              }
            }
          },
        }),
    );
  }

  sendPaymentResultGTMEvent(paymentResult: VehiclePaymentResultModel): void {
    this.GTManagerService.pushOnDataLayer({
      currency: 'IRR',
      value: paymentResult.paidAmount,
      transaction_id: paymentResult.providerId,
      transaction_type: paymentResult.transactionType,
      order_id: paymentResult.applicationFormId,
      user_id: this.storageService.getUserId(),
      coupon: paymentResult.discountCode ?? 'not_set',
      couponvalue: paymentResult.discountAmount ?? 0,
      method: paymentResult.ticketType,
      biz_id: paymentResult.businessId,
      tax: paymentResult.taxAmount ?? 0,
    });
  }

  handleActiveButtonClicked(): void {
    if (this.isHybrid()) {
      let route =
        this.environment.schema_address +
        this.environment.base_href +
        PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] +
        ThirdPartyUrlsEnum.State;
      route +=
        `?${[ThirdPartyKeysEnum.FormId]}=${this.storeService.getFormId()}` +
        (this.referrer ? `&${[ThirdPartyKeysEnum.Referrer]}=${this.referrer}` : '') +
        (this.journeyType ? `&${QueryParamKeysEnum.JourneyType}=${this.journeyType}` : '');
      try {
        window.location.assign(route);
      } catch (e) {
        window.location.href = route;
      }
    } else {
      const route = ThirdPartyUrlsEnum.State;
      this.thirdPartySharedService.navigate(
        route,
        {
          queryParamsHandling: 'merge',
          replace: true,
          queryParams: {
            [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
            [ThirdPartyKeysEnum.ProviderId]: this.providerId,
            [ThirdPartyKeysEnum.Referrer]: this.referrer,
            [QueryParamKeysEnum.JourneyType]: this.journeyType,
          },
        },
        InsuranceProductTypeEnum.ThirdParty,
      );
    }
  }

  handleDeActiveButtonClicked(): void {
    if (this.hasComeFromPriceConflict()) {
      this.thirdPartySharedService.navigate(
        '',
        {
          baseUrl: false,
          queryParamsHandling: null,
        },
        InsuranceProductTypeEnum.ThirdParty,
      );
      return;
    }

    this.thirdPartyApiService.postCompleteLater(this.storeService.getFormId()).subscribe((response) => {
      if (response.success) {
        this.queryParamService
          .addQueryParams({
            [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
            [ThirdPartyKeysEnum.ProviderId]: this.providerId,
            [ThirdPartyKeysEnum.Referrer]: this.referrer,
            [QueryParamKeysEnum.JourneyType]: this.journeyType,
          })
          .then(() => {
            this.thirdPartySharedService.navigate(ThirdPartyUrlsEnum.OrderComplete, null, InsuranceProductTypeEnum.ThirdParty);
          });
      }
    });
  }

  async retryPayment(): Promise<void> {
    void this.navigationService.openWithBackTarget(
      [PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.OrderCheckout],
      [PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.PriceCardList],
      {
        queryParams: {
          [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
          [ThirdPartyKeysEnum.Referrer]: this.referrer,
          [QueryParamKeysEnum.JourneyType]: this.journeyType,
        },
        state: {
          retried: true,
          from: PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdParty] + ThirdPartyUrlsEnum.PaymentResult,
        },
      },
    );
  }
}
