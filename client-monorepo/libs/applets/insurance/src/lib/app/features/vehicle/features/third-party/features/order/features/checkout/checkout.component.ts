import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyKeysEnum } from '../../../../data-access/enums/third-party-keys.enum';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import {
  BottomSheetBoxComponent
} from '../../../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { CarPolicyDetailComponent } from '../../../../components/car-policy-detail/car-policy-detail.component';
import { PolicyDetailModel } from '../../../../data-access/models/policy-detail.model';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import {
  PURCHASE_TICKET_TYPE_TRANSLATOR,
  PurchaseTicketTypeEnum
} from '../../../../../../data-access/enums/purchase-ticket-type.enum';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsAlertComponent } from '../../../../../../../../components/ins-alert/ins-alert.component';
import { AlertSizeEnum } from '../../../../../../../../data-access/enums/alert-size.enum';
import { AlertColorEnum } from '../../../../../../../../data-access/enums/alert-color.enum';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import {
  ThirdPartyRegulationsComponent
} from '../../../../components/third-party-regulations/third-party-regulations.component';
import { BottomSheetService } from '../../../../../../../../data-access/services/bottom-sheet.service';
import { SnackbarService } from '@digipay/ngx-snackbar';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import {
  ApplicationFormGetResponseModel
} from '../../../../../../data-access/models/application-form/application-form-get-response.model';
import { PriceOptionModel } from '../../../../../../data-access/models/application-form/price-option.model';
import { ApplicationFormPaymentService } from '../../data-access/services/application-form-payment.service';
import { StoreService } from '../../../../data-access/services/store.service';
import { SnackbarConfig } from '@digipay/ngx-snackbar/lib/data-access/models/snackbar-config';
import { BnplExtraDetailModel } from '../../../../../../data-access/models/third-party/order/bnpl-extra-detail.model';
import { CheckVpnService } from '../../../../../../../../data-access/services/check-vpn.service';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';
import { FaqCategoryTypeEnum } from '../../../../../../../../data-access/enums/faq-category-type.enum';
import { FaqService } from '../../../../../../../../data-access/services/faq.service';
import {
  ThirdPartyCalloutComponent
} from '../../../../../../components/third-party-callout/third-party-callout.component';
import { SelectedPaymentMethodErrorEnum } from '../../../../../../data-access/enums/selected-payment-method-error.enum';
import { PaymentRequestTypeEnum } from '../../../../../../data-access/enums/payment-request-type.enum';
import { MetricService } from '../../../../../../../../data-access/services/metric.service';
import { PaymentMethodsComponent } from '../../../../../../components/payment-methods/payment-methods.component';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    PipesModule,
    ThirdPartyStepperComponent,
    CarPolicyDetailComponent,
    PaymentMethodsComponent,
    NgxIcon,
    ThirdPartyCalloutComponent,
    InsAlertComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor() {
    super();
  }

  private thirdPartySharedService = inject(VehicleSharedService);
  private queryParamService = inject(QueryParamService);
  private closeService = inject(CloseService);
  private bottomSheetService = inject(BottomSheetService);
  private snackBarService = inject(SnackbarService);
  private applicationFormApiService = inject(ApplicationFormApiService);
  private applicationFormPaymentService = inject(ApplicationFormPaymentService);
  private storeService = inject(StoreService);
  private checkVpnService = inject(CheckVpnService);
  private intrackService = inject(IntrackService);
  private metricService = inject(MetricService);
  private faqService = inject(FaqService);
  protected readonly IconEnum = IconEnum;
  protected readonly PurchaseTicketTypeEnum = PurchaseTicketTypeEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly AlertColorEnum = AlertColorEnum;

  orderData = signal<ApplicationFormGetResponseModel>(null);
  isLoading = signal<boolean>(true);
  policyDetail = signal<PolicyDetailModel>(null);
  selectedMethod = signal<PriceOptionModel>(null);
  snackbarVpnService: SnackbarService;

  protected readonly isNaN = isNaN;

  calloutItems = computed(() => {
    switch (this.selectedMethod()?.ticketType) {
      case PurchaseTicketTypeEnum.BNPL:
        return [
          'خرید اقساطی بدون نیاز به چک و سفته',
          'در صورت عدم پرداخت اقساط در موعد مقرر جریمه دیرکرد برای شما در نظر گرفته خواهد شد.',
          'پس از پرداخت، اطلاعات بیمه‌نامه به‌طور دقیق بررسی می‌شود. در صورت وجود مغایرت در مبلغ یا شرایط بیمه، کارشناسان ما برای هماهنگی و اطلاع‌رسانی با شما تماس خواهند گرفت.',
          'اختلاف قیمت احتمالی(روش پرداخت‌های اقساطی و  کیف‌پول دیجی‌پی) با روش خرید نقدی به دلیل تخفیف روش خرید نقدی است.'
        ];

      default:
        return [
          'پس از پرداخت، اطلاعات بیمه‌نامه به‌طور دقیق بررسی می‌شود. در صورت وجود مغایرت در مبلغ یا شرایط بیمه، کارشناسان ما برای هماهنگی و اطلاع‌رسانی با شما تماس خواهند گرفت.',
          'اختلاف قیمت احتمالی(روش پرداخت‌های اقساطی و  کیف‌پول دیجی‌پی) با روش خرید نقدی به دلیل تخفیف روش خرید نقدی است.'
        ];
    }
  });

  ngOnInit(): void {
    this.checkVpn();
    this.loadOrderDetail();
  }

  private checkVpn(): void {
    this.checkVpnService.checkUseVpn().subscribe(isUseVpn => {
      if (isUseVpn) {
        this.snackbarVpnService = this.snackBarService.openSnackBar({
          message: 'برای جلوگیری از بروز خطا‌، قبل از تایید و پرداخت VPN خود را خاموش کنید.',
          duration: 1000000000,
          status: 'warning',
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.snackbarVpnService?.closeSnackBar();
    this.queryParamService.deleteQueryParams([ThirdPartyKeysEnum.PaymentMethod]);
    super.ngOnDestroy();
  }

  loadOrderDetail(): void {
    this.isLoading.set(true);
    super.addSubscription(this.queryParamService.getQueryParams([ThirdPartyKeysEnum.FormId], false).subscribe({
      next: params => {
        if (params[ThirdPartyKeysEnum.FormId]) {
          this.applicationFormApiService.getApplicationForm(params[ThirdPartyKeysEnum.FormId]).subscribe({
            next: response => {
              this.orderData.set(response.result);
              this.setPolicyDetail();
              this.isLoading.set(false);
            }
          });
        }
      }
    }));
  }

  setPolicyDetail(): void {
    this.policyDetail.set({
      buildYear: this.orderData()?.vehicleInfo.carBuildYear,
      carModel: this.orderData()?.vehicleInfo.carModel,
      carType: this.orderData()?.vehicleInfo.carType,
      coverageRate: this.orderData()?.coverageRate,
      driverDiscount: this.orderData()?.previousInsuranceDetail.driverDiscount,
      duration: this.orderData()?.duration,
      insurerParty: this.orderData()?.currentInsurerParty,
      license: this.orderData()?.license,
      thirdPartyDiscount: this.orderData()?.previousInsuranceDetail.thirdPartyDiscount,
      vehicle: this.orderData()?.vehicleInfo
    });
  }

  handleActiveButtonClicked(): void {
    const confirmError = this.getSelectedMethodError();
    if (confirmError) {
      this.showRelatedError(confirmError);
      return;
    }
    this.postPaymentRequest();
  }

  getSelectedMethodError(): SelectedPaymentMethodErrorEnum {
    if (this.selectedMethod()?.isBanned && this.selectedMethod().ticketType === PurchaseTicketTypeEnum.BNPL) {
      return SelectedPaymentMethodErrorEnum.BNPL_NOT_ENOUGH;
    }
    if (this.selectedMethod()?.ticketType === PurchaseTicketTypeEnum.BNPL &&
      (this.selectedMethod()?.extraDetails as BnplExtraDetailModel).showVerificationAllocationButton) {
      return SelectedPaymentMethodErrorEnum.BNPL_NOT_REQUESTED;
    }
    return null;
  }

  showRelatedError(paymentError: SelectedPaymentMethodErrorEnum): void {
    const relatedSnackbarMessageConfig: Partial<SnackbarConfig> = this.getRelatedSnackBarMessageConfig(paymentError);
    this.snackBarService.openSnackBar(relatedSnackbarMessageConfig);
  }

  getRelatedSnackBarMessageConfig(paymentError: SelectedPaymentMethodErrorEnum): Partial<SnackbarConfig> {
    switch (paymentError) {
      case SelectedPaymentMethodErrorEnum.BNPL_NOT_ENOUGH:
        return {
          message: 'پرداخت با روش اعتباری ممکن نیست.',
          description: 'لطفا روش دیگری(نقدی یا کیف‌پول) برای\n' +
            ' پرداخت انتخاب کنید.',
          duration: 3000,
          status: 'error',
        };
      case SelectedPaymentMethodErrorEnum.BNPL_NOT_REQUESTED:
        return {
          message: 'پرداخت  با روش اعتباری ممکن نیست.',
          description: 'برای پرداخت اعتباری، ابتدا باید درخواست اعتبار\n' +
            ' دهید. در غیر این صورت، می‌توانید روش \n' +
            'پرداخت دیگری را انتخاب کنید.',
          duration: 3000,
          status: 'error',
        };
      default:
        return null;
    }
  }

  postPaymentRequest(): void {
    const priceOption = this.orderData().priceOptions.find(z => z.ticketType === this.selectedMethod().ticketType);
    this.intrackService.sendIntrackEvent('mtpl_checkout', {
      insurer_name: this.policyDetail().insurerParty.insurerPartyName,
      vehicle_brand: this.policyDetail().vehicle.carBrand,
      vehicle_model: this.policyDetail().vehicle.carModel,
      vehicle_plate: this.policyDetail().license,
      payment_method: PURCHASE_TICKET_TYPE_TRANSLATOR[priceOption.ticketType],
      voucher: !!priceOption?.discount?.code,
      voucher_amount: priceOption?.discount?.value
    });

    this.metricService.sendMetric('clickOnConfirmPayment', null, null);

    this.applicationFormPaymentService.postPaymentRequest(
      this.storeService.getFormId(),
      PaymentRequestTypeEnum.ORDER,
      this.selectedMethod().ticketType
    );
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheck();
  }

  handleMethodChanged(ticketType: PurchaseTicketTypeEnum): void {
    this.setPaymentMethodQueryParams(ticketType);
    this.selectedMethod.set(this.orderData()?.priceOptions?.find(option => option.ticketType === ticketType));
  }

  setPaymentMethodQueryParams(ticketType: PurchaseTicketTypeEnum): void {
    this.queryParamService.addQueryParams({[ThirdPartyKeysEnum.PaymentMethod]: PurchaseTicketTypeEnum[ticketType]}, {
      skipLocationChange: true,
    });
  }

  handleVoucherChange(): void {
    this.loadOrderDetail();
  }

  public openConditionTerms(): void {
    this.faqService.open(FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);
  }

  openRegulationsBottomSheet(): void {
    this.bottomSheetService.open(BottomSheetBoxComponent, {
      component: ThirdPartyRegulationsComponent,
      name: 'ThirdPartyRegulationsBottomSheet',
      title: 'قوانین و مقررات'
    });
  }
}
