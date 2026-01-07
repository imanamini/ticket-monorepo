import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditPaymentStepConfigResponse } from '../../data-access/models/credit/activation/credit-payment-step-config.response';
import { CreditPaymentService } from '../../data-access/services/credit-payment.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditPageDialogComponent } from '../../components/credit-page-dialog/credit-page-dialog.component';
import { MessageService } from '../../data-access/services/message.service';
import { CreditPrepaymentNoFundBottomSheetComponent } from '../credit-prepayment-no-fund-bottom-sheet/credit-prepayment-no-fund-bottom-sheet.component';
import { FUND_PROVIDER_CODE } from '../../data-access/models/credit/fund-provider/fund-provider-code';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditPaymentCardComponent } from '../../components/credit-payment-card/credit-payment-card.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { PRE_PAYMENT_STATUS } from '../../data-access/models/credit/activation/customer-type/customer-type-status';
import { CreditPrePaymentStateComponent } from './credit-pre-payment-state/credit-pre-payment-state.component';
import { SelectionBoxComponent } from '../../components/selection-box/selection-box.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'app-credit-payment-step',
  templateUrl: './credit-pre-payment-step.component.html',
  styleUrls: ['./credit-pre-payment-step.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditPaymentCardComponent,
    NgxCalloutComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    NgxStatusResultModule,
    CreditPrePaymentStateComponent,
    SelectionBoxComponent,
    PipesModule,
    NgxDividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPrePaymentStepComponent implements OnInit {
  statusEnum = PRE_PAYMENT_STATUS;
  fundProviderCode!: number;
  creditId!: string;
  title = 'پرداخت هزینه‌ها';
  showNoFundBottomSheet = false;

  config = signal<CreditPaymentStepConfigResponse | null>(null);
  initialized = signal<boolean | null>(null);
  paying = signal<boolean | null>(null);
  status = signal<PRE_PAYMENT_STATUS | undefined>(undefined);
  dailyRemainingDays = signal<number>(0);

  showState = computed(() =>
    [PRE_PAYMENT_STATUS.READY_TO_APPROVE, PRE_PAYMENT_STATUS.REJECTED, PRE_PAYMENT_STATUS.DELAYED].includes(this.status()!),
  );
  totalAmount = computed(() => (this.config()?.initialBalance || 0) - (this.config()?.stampPrice || 0));

  private bottomSheetService = inject(NgxBottomSheetService);
  private creditApiService = inject(CreditApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(CreditPaymentService);
  private creditUrlService = inject(CreditUrlService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getStatus();
  }

  getStatus() {
    this.creditApiService.getPrePaymentStepStatus(this.creditId).subscribe({
      next: (response) => {
        this.status.set(response.status);
        this.dailyRemainingDays.set(response.detail.dailyRemainingDays);
        this.getConfig();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  getConfig(): void {
    this.creditApiService.getPrePaymentStepConfig(this.creditId, this.fundProviderCode).subscribe((response) => {
      this.config.set(response);
      this.initialized.set(true);
    });
  }

  initPayment(): void {
    if (
      this.showNoFundBottomSheet &&
      (this.fundProviderCode === FUND_PROVIDER_CODE.MELLAT || this.fundProviderCode === FUND_PROVIDER_CODE.TEJARAT)
    ) {
      this.openNoFundBottomSheet();
    } else {
      this.goToPay();
    }
  }

  openNoFundBottomSheet() {
    this.bottomSheetService.openBottomSheet(CreditPrepaymentNoFundBottomSheetComponent, {
      fundProviderCode: this.fundProviderCode,
    });

    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result: any = this.bottomSheetService.outputData();
      if (result && result === true) {
        this.goToPay();
      }
    });
  }

  goBack() {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}`),
    );
  }

  openTac() {
    this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
      title: 'قوانین و شرایط ثبت نام',
      relativeUrl: this.config()?.tacUrl,
    });
  }

  goToPay() {
    this.paying.set(true);
    this.creditApiService
      .initPrePaymentStep(
        this.creditId,
        this.fundProviderCode,
        this.creditUrlService.getPaymentTicketCallbackUrl('pre-payment-step', `/${this.fundProviderCode}/${this.creditId}`),
        this.creditUrlService.getUrlAfterResult(
          this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
        ),
      )
      .subscribe({
        next: (response) => {
          this.paymentService
            .pay(
              'pre-payment-step',
              response.ticket,
              this.config()?.amount,
              `/${this.fundProviderCode}/${this.creditId}`,
              this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${this.fundProviderCode}/${this.creditId}/next`),
            )
            .then();
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.paying.set(false);
        },
      });
  }
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
