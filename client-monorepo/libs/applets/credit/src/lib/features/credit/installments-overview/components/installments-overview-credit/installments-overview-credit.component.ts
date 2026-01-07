import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { InstallmentsOverviewCredit } from '../../data-access/installments-overview-credit';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditInstallmentPaymentService } from '../../../data-access/services/credit-installment-payment.service';
import { CreditInstallmentPaymentFooterRow } from '../../../components/credit-installment-payment-footer/data-access/credit-installment-payment-footer-row';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { InstallmentsOverviewNotFoundComponent } from '../installment-overview-not-found/installment-overview-not-found.component';
import { InstallmentOverviewCardComponent } from '../installment-overview-card/installment-overview-card.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditInstallmentPaymentFooterComponent } from '../../../components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { AggregationInstallmentFields } from '../../../data-access/models/credit/installment/installment';
import { ConfigPaymentFlow } from '../../../data-access/models/credit/installment/installment-pay-config.response';
import { CreditTransactionCallbackType } from '../../../credit-payment-callback/data-access/credit-transaction-callback-type';
import { NgxStateService, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { Router } from '@angular/router';
import { InstallmentsOverviewRefererService } from '../../services/installments-overview-referer.service';
import { DefaultInstallmentReferer } from '../../../data-access/models/credit/installment/installment-referer.model';
import { CallbackInstallmentsOverviewKey } from '../../../credit-payment-callback/components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';
import { CREDIT_ENVIRONMENT } from '../../../credit-environment.interface';
import { NgxNoticeService } from '@digipay/ngx-notice';
import { InstallmentsOverviewSourceUrlService } from '../../services/installments-overview-source-url.service';

interface FooterAmounts {
  payable: number;
  penalty: number;
  penaltyWaiver: number;
  fee: number;
  clearDiscountAmount: number;
}

@Component({
  selector: 'app-installments-overview-credit',
  templateUrl: './installments-overview-credit.component.html',
  styleUrl: 'installments-overview-credit.component.scss',
  standalone: true,
  imports: [
    NgxSegmentedControlComponent,
    InstallmentsOverviewNotFoundComponent,
    InstallmentOverviewCardComponent,
    NgxCheckboxComponent,
    NgxDividerComponent,
    NgxIcon,
    PipesModule,
    CreditInstallmentPaymentFooterComponent,
    NgxStatusResultModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentsOverviewCreditComponent implements OnInit {
  // Services
  private router = inject(Router);
  private messageService = inject(MessageService);
  private ngxStateService = inject(NgxStateService);
  private creditUrlService = inject(CreditUrlService);
  private refererService = inject(InstallmentsOverviewRefererService);
  public creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);
  private noticeService = inject(NgxNoticeService);
  private sourceUrlService = inject(InstallmentsOverviewSourceUrlService);

  // Inputs
  notHaveActiveCredit = input(false);
  contractInstallments = model.required<InstallmentsOverviewCredit[]>();

  // Signals
  selectedContractIndex = signal(0);
  checkAll = signal(false);
  canCheckAll = signal(true);
  selectedAmounts = signal<FooterAmounts>({
    payable: 0,
    penalty: 0,
    penaltyWaiver: 0,
    fee: 0,
    clearDiscountAmount: 0,
  });
  clearConfirmImgContent = viewChild<TemplateRef<any>>('clearConfirmImg');
  clearConfirmBodyContent = viewChild<TemplateRef<any>>('clearConfirmBody');

  // Computed
  emptyInstallments = computed(() => this.contractInstallments().length === 0);
  selectedContractInstallment = computed(() => this.contractInstallments()[this.selectedContractIndex()]);
  paymentFooterRows = computed<CreditInstallmentPaymentFooterRow[]>(() => this.makePaymentFooterRows());
  tabOptions = computed<SegmentItemsModel[]>(() => {
    return this.contractInstallments().map((contract, index) => {
      return {
        id: contract.fundProvider.englishName,
        text: contract.fundProvider.name,
        value: index,
      };
    });
  });

  // Variables
  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  ngOnInit() {
    if (!this.notHaveActiveCredit() && !this.emptyInstallments()) {
      this.scanDeActiveInstallments();
      this.scanCheckAll();
      this.calculateSelectedAmounts();
    }
  }

  onSelectedOptionChange($event: unknown) {
    this.selectedContractIndex.set(($event as SegmentItemsModel).value as number);
    this.scanDeActiveInstallments();
    this.scanCheckAll();
    this.calculateSelectedAmounts();
  }

  scanDeActiveInstallments() {
    const haveDeActiveInstallment = this.selectedContractInstallment().installments.some((installment) => installment.deActive);
    if (haveDeActiveInstallment) {
      this.canCheckAll.set(false);
    }
  }

  deActiveClickHandler() {
    this.noticeService.openModal({
      state: 'warning',
      title: 'محدودیت تعداد اقساط',
      description: `ابتدا تا قسط ${this.selectedContractInstallment().maxPayableInstallmentOrder} را پرداخت کرده و بعد از تراکنش موفق، برای پرداخت باقی اقساط اقدام فرمایید.`,
      primaryButtonLabel: 'متوجه شدم',
    });
  }

  checkAllClickHandler() {
    this.checkAll.update((prev) => !prev);
    this.onCheckAllChange(this.checkAll());
  }

  private onCheckAllChange(toCheck: unknown) {
    if (typeof toCheck === 'boolean') {
      if (toCheck) {
        this.changeAllInstallments(true);
      } else {
        this.changeAllInstallments(false);
      }
    }
    this.calculateSelectedAmounts();
  }

  onCheckChange(toCheck: boolean, index: number) {
    this.scanCheckPrecedence(toCheck, index);
    this.scanCheckAll();
    setTimeout(() => {
      this.calculateSelectedAmounts();
    });
  }

  private changeAllInstallments(toCheck: boolean) {
    this.contractInstallments.update((prev) => {
      const newContractInstallments = [...prev];
      const selectedContractInstallmentsCopy = [...newContractInstallments[this.selectedContractIndex()].installments];
      newContractInstallments[this.selectedContractIndex()].installments = selectedContractInstallmentsCopy.map((installment) => ({
        ...installment,
        checked: signal(toCheck),
      }));
      return newContractInstallments;
    });
  }

  private scanCheckPrecedence(toCheck: boolean, index: number) {
    if (toCheck) {
      const canCheck = index === 0 || this.selectedContractInstallment().installments[index - 1].checked();
      if (canCheck) {
        return;
      } else {
        setTimeout(() => {
          this.selectedContractInstallment().installments[index].checked.set(false);
        }, 0);

        this.messageService.showErrorMessage('اولویت پرداخت اقساط بالاتر بیشتر است. لطفا این اولویت‌بندی را در انتخاب آن‌ها رعایت کنید.');
      }
    } else {
      const laterUnchecked = this.selectedContractInstallment().installments.map((installment, installmentIndex) => {
        if (installmentIndex >= index) {
          return { ...installment, checked: signal(false) };
        } else {
          return { ...installment };
        }
      });
      this.contractInstallments.update((prev) => {
        const newContractInstallments = [...prev];
        newContractInstallments[this.selectedContractIndex()].installments = laterUnchecked;
        return newContractInstallments;
      });
    }
  }

  private scanCheckAll() {
    const unCheckExists = this.selectedContractInstallment().installments.some((installment) => !installment.checked());
    if (unCheckExists) {
      this.checkAll.set(false);
    } else {
      this.checkAll.set(true);
    }
  }

  private calculateSelectedAmounts() {
    let totalPayable = 0;
    let totalPenalty = 0;
    let totalPenaltyWaiver = 0;
    let totalFee = 0;
    this.selectedContractInstallment().installments.forEach((installment) => {
      if (installment.checked()) {
        totalPayable += installment.amount;
        totalPenalty += installment.penalty;
        totalPenaltyWaiver += installment.penaltyWaiverAmount;
        totalFee += installment.fee;
      }
    });
    const clearAmount = this.selectedContractInstallment().clearAmount;
    const isClear = clearAmount ? totalPayable >= clearAmount : false;

    this.selectedAmounts.set({
      payable: isClear ? clearAmount! : totalPayable,
      penalty: totalPenalty,
      penaltyWaiver: totalPenaltyWaiver,
      fee: totalFee,
      clearDiscountAmount: isClear ? this.selectedContractInstallment().discountAmount : 0,
    });
  }

  private makePaymentFooterRows() {
    if (this.selectedAmounts().penalty || this.selectedAmounts().fee || this.selectedAmounts().clearDiscountAmount) {
      const rows: CreditInstallmentPaymentFooterRow[] = [
        {
          title: 'جمع اقساط انتخاب شده',
          value:
            this.selectedAmounts().payable -
            this.selectedAmounts().penalty +
            this.selectedAmounts().penaltyWaiver -
            this.selectedAmounts().fee +
            this.selectedAmounts().clearDiscountAmount,
          type: 'default',
          status: 'default',
        },
      ];

      if (this.selectedAmounts().penalty) {
        rows.push({
          title: 'جریمه دیرکرد',
          value: this.selectedAmounts().penalty,
          type: 'increase',
          status: 'error',
        });
      }

      if (this.selectedAmounts().penaltyWaiver) {
        rows.push({
          title: 'بخشش جریمه',
          value: this.selectedAmounts().penaltyWaiver,
          type: 'decrease',
          status: 'success',
        });
      }

      if (this.selectedAmounts().clearDiscountAmount) {
        rows.push({
          title: 'تخفیف تسویه کامل',
          value: this.selectedAmounts().clearDiscountAmount,
          type: 'decrease',
          status: 'success',
        });
      }

      if (this.selectedAmounts().fee) {
        rows.push({
          title: 'جمع کارمزد',
          value: this.selectedAmounts().fee,
          type: 'increase',
          status: 'default',
        });
      }

      return rows;
    } else {
      return [];
    }
  }

  onFooterPaymentClick() {
    const aggregateDataForTicket: [AggregationInstallmentFields] = [
      {
        trackingCode: this.selectedContractInstallment().contractTrackingCode,
        amount: 0,
        count: 0,
      },
    ];
    this.selectedContractInstallment().installments.forEach((installment) => {
      if (installment.checked()) {
        ++aggregateDataForTicket[0].count;
        aggregateDataForTicket[0].amount += installment.amount;
      }
    });

    const clearAmount = this.selectedContractInstallment().clearAmount;
    const isClear = clearAmount ? aggregateDataForTicket[0].amount >= clearAmount : false;

    if (isClear) {
      this.handleClear(aggregateDataForTicket);
      this.ngxStateService.openBottomSheet({
        title: 'تسویه کامل',
        imgContent: this.clearConfirmImgContent(),
        htmlContent: this.clearConfirmBodyContent(),
        buttons: [
          {
            fullWidth: true,
            id: 'accept',
            mode: 'form',
            label: 'تایید و ادامه',
            style: 'fill',
            size: 'large',
          },
          {
            fullWidth: true,
            id: 'reject',
            mode: 'form',
            label: 'انصراف',
            style: 'tinted-on-elevated',
          },
        ],
      });

      const state = this.ngxStateService.onClose().subscribe(() => {
        state.unsubscribe();
        const result = this.ngxStateService.outputData();
        if (result && result.clicked === 'accept') {
          this.pay(aggregateDataForTicket);
        }
      });
    } else {
      this.pay(aggregateDataForTicket);
    }
  }

  private handleClear(aggregateDataForTicket: [AggregationInstallmentFields]) {
    aggregateDataForTicket[0].clear = true;
    aggregateDataForTicket[0].count = 1;
    aggregateDataForTicket[0].amount = this.selectedContractInstallment().clearAmount!;
  }

  private pay(aggregateDataForTicket: [AggregationInstallmentFields]) {
    if (aggregateDataForTicket[0].amount > this.selectedContractInstallment().maxLimitAmount) {
      return this.creditInstallmentPaymentService.outOfRangeAmountHandler();
    }
    const sourceUrl = this.sourceUrlService.sourceUrl();
    if (this.selectedContractInstallment().paymentFlow === ConfigPaymentFlow.internal) {
      this.creditInstallmentPaymentService.internalFlowPay({
        getTicketPayload: {
          ticketRequestDetails: aggregateDataForTicket,
        },
        callbackUrl: this.creditUrlService.getPaymentTicketCallbackUrl(
          CreditTransactionCallbackType.installmentsOverview,
          sourceUrl ? `?${CallbackInstallmentsOverviewKey}=${sourceUrl}` : '',
        ),
        referer:
          this.refererService.enrichReferer(this.refererService.referer()) || this.refererService.enrichReferer(DefaultInstallmentReferer),
      });
    }
    if (this.selectedContractInstallment().paymentFlow === ConfigPaymentFlow.external) {
      this.creditInstallmentPaymentService.externalFlowPay(
        {
          aggregateTicketDto: {
            ticketRequestDetails: aggregateDataForTicket,
          },
          amount: aggregateDataForTicket[0].amount,
        },
        aggregateDataForTicket[0].amount,
        this.creditUrlService.getPaymentTicketCallbackUrl(
          CreditTransactionCallbackType.installmentsOverview,
          sourceUrl ? `?${CallbackInstallmentsOverviewKey}=${sourceUrl}` : '',
        ),
      );
    }
  }

  emptyInstallmentsActionHandler() {
    this.router.navigate(['stores']);
  }

  creditNotFoundActionHandler() {
    this.router.navigate(['service/credit/pre-register'], {
      queryParams: {
        step: 'Plan',
      },
    });
  }
}
