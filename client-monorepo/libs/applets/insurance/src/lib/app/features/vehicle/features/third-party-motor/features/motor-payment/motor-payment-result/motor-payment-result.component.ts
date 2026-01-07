import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { InsIconComponent } from '../../../../../components/ins-icon/ins-icon.component';
import { ActionButtonsComponent } from '../../../../../../../components/action-buttons/action-buttons.component';
import { UiLoadingSpinnerComponent } from '../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { EnvironmentService } from '@client-monorepo/app-core';
import { ThirdPartyMotorDirective } from '../../../directives/third-party-motor.directive';
import { InsAlertComponent } from '../../../../../../../components/ins-alert/ins-alert.component';
import { IconEnum } from '../../../../../../../data-access/enums/icon.enum';
import { AlertColorEnum } from '../../../../../../../data-access/enums/alert-color.enum';
import { GoogleTagManagerService } from '../../../../../../../data-access/services/google-tag-manager/angular-google-tag-manager.service';
import { NavigationService } from '../../../../../../../data-access/services/navigation.service';
import { JourneyType, QueryParamKeysEnum } from '../../../../../../home/query-param-keys.enum';
import { IntrackService } from '../../../../../../../data-access/services/intrack.service';
import { MotorStorePaymentDataService } from '../../../data-access/services/motor-store-payment-data.service';
import { ThirdPartyKeysEnum } from '../../../../third-party/data-access/enums/third-party-keys.enum';
import { PaymentRequestTypeEnum } from '../../../../../data-access/enums/payment-request-type.enum';
import { VehiclePaymentResultModel } from '../../../../../data-access/models/third-party/payment/vehicle-payment-result.model';
import { PRODUCT_TYPE_BASE_URL } from '../../../../../../../data-access/constants/product-type-base-url.constant';
import { InsuranceProductTypeEnum } from '../../../../../../../data-access/enums/Insurance-product-type.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../../data-access/constants/third-party-motor-route.const';
import { StorageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'motor-payment-result',
  standalone: true,
  imports: [InsIconComponent, ActionButtonsComponent, NgxTooltipDirective, UiLoadingSpinnerComponent, InsAlertComponent],
  templateUrl: './motor-payment-result.component.html',
  styleUrl: './motor-payment-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MotorPaymentResultComponent extends ThirdPartyMotorDirective implements OnInit {
  constructor() {
    super();
  }

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

  private readonly intrackService = inject(IntrackService);
  private readonly paymentResultService = inject(MotorStorePaymentDataService);
  public readonly navigationService = inject(NavigationService);
  private GTManagerService = inject(GoogleTagManagerService);
  private storageService = inject(StorageService);

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  ngOnInit(): void {
    this.GTManagerService.handleDuplicatePaymentResultEvent();
    this.getPaymentResult();
  }

  getPaymentResult(): void {
    super.addSubscription(
      this.queryParamService
        .getQueryParams([ThirdPartyKeysEnum.ProviderId, ThirdPartyKeysEnum.FormId, ThirdPartyKeysEnum.Referrer])
        .subscribe({
          next: (params) => {
            if (params[ThirdPartyKeysEnum.ProviderId]) {
              super.addSubscription(
                this.motorApiService.getPaymentResult(params[ThirdPartyKeysEnum.ProviderId]).subscribe({
                  next: (response) => {
                    this.isSuccessful.set(response.result.isSuccess);
                    this.storeService.setFormId(response.result.applicationFormId);
                    this.paymentTrackingCode.set(response.result.paymentTrackingCode);
                    this.orderTrackingCode.set(response.result.trackingCode);
                    this.hasComeFromPriceConflict.set(response.result.paymentRequestType === PaymentRequestTypeEnum.CONFLICT);
                    this.isHybrid.set(response.result.isHybrid);
                    this.providerId = params[ThirdPartyKeysEnum.ProviderId];
                    this.referrer = response.result.referrer ?? this.referrerService.referrer ?? params[ThirdPartyKeysEnum.Referrer];
                    this.journeyType = this.referrerService.entryFunnelSource ?? (params[QueryParamKeysEnum.JourneyType] as JourneyType);
                    if (this.journeyType) {
                      this.referrerService.entryFunnelSource = this.journeyType;
                    }
                    this.sendPaymentResultGTMEvent(response.result);
                    this.intrackService.sendIntrackEvent('V_M_PRS', { paymentResult: response.result.isSuccess ? 1 : 0 });
                    this.intrackService.sendIntrackEvent('mtpl_M_payment_result', {
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
        PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor] +
        THIRD_PARTY_MOTOR_ROUTE.OrderState;
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
      this.router.navigate([`/${PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor]}${THIRD_PARTY_MOTOR_ROUTE.OrderState}`], {
        queryParamsHandling: 'merge',
        replaceUrl: true,
        queryParams: {
          [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
          [ThirdPartyKeysEnum.ProviderId]: this.providerId,
          [ThirdPartyKeysEnum.Referrer]: this.referrer,
        },
      });
    }
  }

  handleDeActiveButtonClicked(): void {
    if (this.hasComeFromPriceConflict()) {
      return;
    }

    this.motorApiService.postCompleteLater(this.storeService.getFormId()).subscribe((response) => {
      if (response.success) {
        this.router.navigate(
          [`/${PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor]}${THIRD_PARTY_MOTOR_ROUTE.CompleteOrder}`],
          {
            relativeTo: this.activatedRoute.parent.parent,
            queryParamsHandling: 'merge',
            replaceUrl: true,
            queryParams: {
              [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
              [ThirdPartyKeysEnum.ProviderId]: this.providerId,
              [ThirdPartyKeysEnum.Referrer]: this.referrer,
            },
          },
        );
      }
    });
  }

  async retryPayment(): Promise<void> {
    void this.navigationService.openWithBackTarget(
      [PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor] + THIRD_PARTY_MOTOR_ROUTE.Checkout],
      [PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor] + THIRD_PARTY_MOTOR_ROUTE.PriceCardList],
      {
        queryParams: {
          [ThirdPartyKeysEnum.FormId]: this.storeService.getFormId(),
          [ThirdPartyKeysEnum.Referrer]: this.referrer,
          [QueryParamKeysEnum.JourneyType]: this.journeyType,
        },
        state: {
          retried: true,
          from: PRODUCT_TYPE_BASE_URL[InsuranceProductTypeEnum.ThirdPartyMotor] + THIRD_PARTY_MOTOR_ROUTE.PaymentResult,
        },
      },
    );
  }

  protected onClose(): void {}

  protected onNext(route: string): void {}
}
