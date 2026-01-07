import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { PriceOptionModel } from '../../../../data-access/models/application-form/price-option.model';
import { SnackbarConfig } from '@digipay/ngx-snackbar/lib/data-access/models/snackbar-config';
import {
  PurchaseTicketTypeEnum,
  PURCHASE_TICKET_TYPE_TRANSLATOR
} from '../../../../data-access/enums/purchase-ticket-type.enum';
import { BnplExtraDetailModel } from '../../../../data-access/models/third-party/order/bnpl-extra-detail.model';
import { CheckVpnService } from '../../../../../../data-access/services/check-vpn.service';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { MotorApplicationFormPaymentService } from '../../data-access/services/motor-application-form-payment.service';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { MotorPolicyDetailModel } from '../../data-access/models/motor-policy-detail.model';
import { MotorPolicyDetailComponent } from '../../components/motor-policy-detail/motor-policy-detail.component';
import { FaqCategoryTypeEnum } from '../../../../../../data-access/enums/faq-category-type.enum';
import { FaqService } from '../../../../../../data-access/services/faq.service';
import { ThirdPartyCalloutComponent } from '../../../../components/third-party-callout/third-party-callout.component';
import { PaymentMethodsComponent } from '../../../../components/payment-methods/payment-methods.component';
import { SelectedPaymentMethodErrorEnum } from '../../../../data-access/enums/selected-payment-method-error.enum';
import { ApplicationFormMotorModel } from '../../data-access/models/application-form-motor-response.model';
import { PaymentRequestTypeEnum } from '../../../../data-access/enums/payment-request-type.enum';

@Component({
  selector: 'motor-checkout',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    PipesModule,
    PaymentMethodsComponent,
    ThirdPartyCalloutComponent,
    InsAlertComponent,
    NgxSkeletonLoadingComponent,
    MotorPolicyDetailComponent,
    ThirdPartyCalloutComponent,
  ],
  templateUrl: './motor-checkout.component.html',
  styleUrl: './motor-checkout.component.scss'
})
export class MotorCheckoutComponent extends ThirdPartyMotorDirective implements OnInit, OnDestroy {
  private snackBarService = inject(SnackbarService);
  private checkVpnService = inject(CheckVpnService);
  private intrackService = inject(IntrackService);
  private faqService = inject(FaqService);
  private motorApplicationFormPaymentService = inject(MotorApplicationFormPaymentService);

  protected readonly IconEnum = IconEnum;
  protected readonly PurchaseTicketTypeEnum = PurchaseTicketTypeEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly AlertColorEnum = AlertColorEnum;

  orderData = signal<ApplicationFormMotorModel>(null);
  isLoading = signal<boolean>(true);
  policyDetail = signal<MotorPolicyDetailModel>(null);
  selectedMethod = signal<PriceOptionModel>(null);

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

  snackbarVpnService: SnackbarService | null = null;

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

  private loadOrderDetail(): void {
    this.isLoading.set(true);
    super.addSubscription(this.motorApiService.getApplicationForm(this.storeService.getFormId()).subscribe({
      next: response => {
        this.orderData.set(response.result);
        this.storeService.setStoreData(response.result);
        this.setPolicyDetail();
        this.isLoading.set(false);
      }
    }));
  }

  setPolicyDetail(): void {
    this.policyDetail.set({
      motorType: this.orderData()?.vehicleInfo.type,
      buildYear: this.orderData()?.vehicleInfo?.buildYear,
      coverageRate: this.orderData()?.coverageRate,
      duration: this.orderData()?.duration,
      driverDiscount: this.orderData()?.previousInsuranceDetail.driverDiscount,
      thirdPartyDiscount: this.orderData()?.previousInsuranceDetail.thirdPartyDiscount,
      insurerPartyName: this.orderData()?.currentInsurerParty?.insurerPartyName,
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

  getSelectedMethodError(): SelectedPaymentMethodErrorEnum | null {
    if (this.selectedMethod()?.isBanned && this.selectedMethod().ticketType === PurchaseTicketTypeEnum.BNPL) {
      return SelectedPaymentMethodErrorEnum.BNPL_NOT_ENOUGH;
    }
    if (this.selectedMethod()?.ticketType === PurchaseTicketTypeEnum.BNPL &&
      (this.selectedMethod().extraDetails as BnplExtraDetailModel)?.showVerificationAllocationButton) {
      return SelectedPaymentMethodErrorEnum.BNPL_NOT_REQUESTED;
    }
    return null;
  }

  showRelatedError(paymentError: SelectedPaymentMethodErrorEnum): void {
    const relatedSnackbarMessageConfig: Partial<SnackbarConfig> = this.getRelatedSnackBarMessageConfig(paymentError);
    this.snackBarService.openSnackBar(relatedSnackbarMessageConfig);
  }

  getRelatedSnackBarMessageConfig(paymentError: SelectedPaymentMethodErrorEnum): Partial<SnackbarConfig> | null {
    switch (paymentError) {
      case SelectedPaymentMethodErrorEnum.BNPL_NOT_ENOUGH:
        return {
          message: 'پرداخت با روش اعتباری ممکن نیست.',
          description: 'لطفا روش دیگری(نقدی یا کیف‌پول) برای\n پرداخت انتخاب کنید.',
          duration: 3000,
          status: 'error',
        };
      case SelectedPaymentMethodErrorEnum.BNPL_NOT_REQUESTED:
        return {
          message: 'پرداخت  با روش اعتباری ممکن نیست.',
          description: 'برای پرداخت اعتباری، ابتدا باید درخواست اعتبار\n دهید. در غیر این صورت، می‌توانید روش \nپرداخت دیگری را انتخاب کنید.',
          duration: 3000,
          status: 'error',
        };
      default:
        return null;
    }
  }

  postPaymentRequest(): void {
    const priceOption = this.orderData()?.priceOptions?.find(z => z.ticketType === this.selectedMethod().ticketType);
    this.intrackService.sendIntrackEvent('motor_third_party_checkout', {
      insurer_name: this.policyDetail()?.insurerPartyName,
      motor_type: this.policyDetail()?.motorType,
      motor_build_year: this.policyDetail()?.buildYear,
      payment_method: PURCHASE_TICKET_TYPE_TRANSLATOR[priceOption.ticketType],
      voucher: !!priceOption?.discount?.code,
      voucher_amount: priceOption?.discount?.value
    });

    this.metricService.sendMetric('clickOnConfirmPayment', null, null);

    this.motorApplicationFormPaymentService.postPaymentRequest(
      this.storeService.getFormId(),
      PaymentRequestTypeEnum.ORDER,
      this.selectedMethod().ticketType
    );
  }

  handleDeActiveButtonClicked(): void {
    if ((window.history?.length ?? 0) > 1) {
      history.back();
    }
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheck();
  }

  handleMethodChanged(ticketType: PurchaseTicketTypeEnum): void {
    this.setPaymentMethodQueryParams(ticketType);
    this.selectedMethod.set(this.orderData()?.priceOptions?.find(option => option.ticketType === ticketType) || null);
  }

  setPaymentMethodQueryParams(ticketType: PurchaseTicketTypeEnum): void {
    this.queryParamService.addQueryParams({[ThirdPartyMotorKeysEnum.PaymentMethod]: PurchaseTicketTypeEnum[ticketType]}, {
      skipLocationChange: true,
    });
  }

  handleVoucherChange(): void {
    this.loadOrderDetail();
  }

  public openConditionTerms(): void {
    this.faqService.open(FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);
  }

  protected onClose(): void {
    throw new Error('Method not implemented.');
  }

  protected onNext(route: string): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.snackbarVpnService?.closeSnackBar();
    this.queryParamService.deleteQueryParams([ThirdPartyMotorKeysEnum.PaymentMethod]);
    super.ngOnDestroy();
  }
}
