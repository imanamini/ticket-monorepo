import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import moment from 'jalali-moment';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { InstallmentOverviewCardComponent } from '../installment-overview-card/installment-overview-card.component';
import { CircleIndicatorComponent } from '../circle-indicator/circle-indicator.component';
import { InstallmentsOverviewNotFoundComponent } from '../installment-overview-not-found/installment-overview-not-found.component';
import {
  InstallmentsOverviewBnplHistoryStateKey,
  InstallmentsOverviewBnplInitSelected,
  InstallmentsOverviewBnplList,
} from '../../data-access/installments-overview-bnpl';
import { CreditPersianDatePipe } from '../../../data-access/pipes/credit-persian-date.pipe';
import { CreditInstallmentPaymentFooterComponent } from '../../../components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { CreditInstallmentPaymentFooterRow } from '../../../components/credit-installment-payment-footer/data-access/credit-installment-payment-footer-row';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditInstallmentPaymentService } from '../../../data-access/services/credit-installment-payment.service';
import { AggregationInstallmentFields } from '../../../data-access/models/credit/installment/installment';
import { ConfigPaymentFlow } from '../../../data-access/models/credit/installment/installment-pay-config.response';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditTransactionCallbackType } from '../../../credit-payment-callback/data-access/credit-transaction-callback-type';
import { Router } from '@angular/router';
import { InstallmentsOverviewRefererService } from '../../services/installments-overview-referer.service';
import { DefaultInstallmentReferer } from '../../../data-access/models/credit/installment/installment-referer.model';
import { CallbackInstallmentsOverviewKey } from '../../../credit-payment-callback/components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { InstallmentsOverviewPurchaseDetailsComponent } from '../installments-overview-purchase-details/installments-overview-purchase-details.component';
import { BillingCycleInfo } from '../../data-access/get-installments-overview-response';
import { CREDIT_ENVIRONMENT } from '../../../credit-environment.interface';
import { InstallmentsOverviewSourceUrlService } from '../../services/installments-overview-source-url.service';

interface FooterAmounts {
  payable: number;
  penalty: number;
  penaltyWaiver: number;
  fee: number;
}

interface DateFilters {
  all: boolean;
  currentMonth: boolean;
  future: boolean;
}

@Component({
  selector: 'app-installments-overview-bnpl',
  templateUrl: './installments-overview-bnpl.component.html',
  styleUrl: 'installments-overview-bnpl.component.scss',
  standalone: true,
  imports: [
    NgxChipComponent,
    NgxCheckboxComponent,
    NgxDividerComponent,
    InstallmentOverviewCardComponent,
    CircleIndicatorComponent,
    InstallmentsOverviewNotFoundComponent,
    CreditPersianDatePipe,
    CreditInstallmentPaymentFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentsOverviewBnplComponent implements OnInit {
  // Services
  private router = inject(Router);
  private messageService = inject(MessageService);
  private creditUrlService = inject(CreditUrlService);
  private refererService = inject(InstallmentsOverviewRefererService);
  public creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);
  private bottomSheet = inject(NgxBottomSheetService);
  private sourceUrlService = inject(InstallmentsOverviewSourceUrlService);

  // Inputs
  notHaveActiveBnpl = input(false);
  categorizedInstallments = input.required<InstallmentsOverviewBnplList>();
  paymentFlow = input.required<ConfigPaymentFlow>();
  paymentMaxLimitAmount = input.required<number>();

  // Signals
  checkAll = signal(false);
  selectedAmounts = signal<FooterAmounts>({
    payable: 0,
    penalty: 0,
    penaltyWaiver: 0,
    fee: 0,
  });
  dateFilters = signal<DateFilters>({
    all: true,
    currentMonth: false,
    future: false,
  });
  filteredCategorizedInstallments = signal<InstallmentsOverviewBnplList | null>(null);
  paymentFooterRows = computed<CreditInstallmentPaymentFooterRow[]>(() => this.makePaymentFooterRows());
  emptyInstallments = computed(() => this.categorizedInstallments().length === 0);

  // Variables
  emptyDateFilter: DateFilters = {
    all: false,
    currentMonth: false,
    future: false,
  };
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  ngOnInit() {
    if (!this.notHaveActiveBnpl() && !this.emptyInstallments()) {
      this.setFilteredCategorizedInstallments();
      this.checkInitSelectedFromHistoryState();
      this.scanCheckAll();
      this.calculateSelectedAmounts();
    }
  }

  checkInitSelectedFromHistoryState() {
    if (window.history.state) {
      const initSelect = window.history.state[InstallmentsOverviewBnplHistoryStateKey] as InstallmentsOverviewBnplInitSelected;
      if (initSelect) {
        this.changeAllInstallments(false);
        switch (initSelect.type) {
          case 'Account':
            this.initSelectForAccount(initSelect.creditId);
            break;
          case 'ContractFirstInstallment':
            this.initSelectForContractFirstInstallment(initSelect.contractTrackingCode);
            break;
          case 'XPay':
            this.initSelectForAllXPay();
            break;
        }
      }
    }
  }

  private initSelectForAccount(creditId: string) {
    let hasDueInstallment = false;
    const newFilteredCategorizedInstallments = this.filteredCategorizedInstallments()?.map((catIns) => {
      const newInstallments = catIns.installments.map((ins) => {
        const checked = ins.creditId === creditId && ins.isDue;
        if (checked) {
          hasDueInstallment = true;
        }
        return {
          ...ins,
          checked: signal(checked ? checked : ins.checked()), // Should canCheckInstallment if we check init after filters other than all filters
        };
      });
      return {
        ...catIns,
        installments: newInstallments,
      };
    });
    if (!hasDueInstallment) {
      this.selectFirstAccountInstallment(creditId, newFilteredCategorizedInstallments);
    }
    newFilteredCategorizedInstallments && this.filteredCategorizedInstallments.set(newFilteredCategorizedInstallments);
  }

  private selectFirstAccountInstallment(creditId: string, filteredCategorizedInstallments?: InstallmentsOverviewBnplList) {
    filteredCategorizedInstallments?.forEach((ctaIns) => {
      ctaIns.installments.forEach((ins) => {
        if (ins.creditId === creditId) {
          ins.checked = signal(true);
          return;
        }
      });
    });
  }

  private initSelectForContractFirstInstallment(contractTrackingCode: string) {
    let firstSelected = false;
    const newFilteredCategorizedInstallments = this.filteredCategorizedInstallments()?.map((catIns) => {
      const newInstallments = catIns.installments.map((ins) => {
        const checked = ins.contractTrackingCode === contractTrackingCode && !firstSelected;
        checked && (firstSelected = true);
        return {
          ...ins,
          checked: signal(checked ? checked : ins.checked()), // Should canCheckInstallment if we check init after filters other than all filters
        };
      });
      return {
        ...catIns,
        installments: newInstallments,
      };
    });
    newFilteredCategorizedInstallments && this.filteredCategorizedInstallments.set(newFilteredCategorizedInstallments);
  }

  private initSelectForAllXPay() {
    const newFilteredCategorizedInstallments = this.filteredCategorizedInstallments()?.map((catIns) => {
      const newInstallments = catIns.installments.map((ins) => {
        const checked = ins.contractTotalInstallmentsCount > 1;
        return {
          ...ins,
          checked: signal(checked ? checked : ins.checked()), // Should canCheckInstallment if we check init after filters other than all filters
        };
      });
      return {
        ...catIns,
        installments: newInstallments,
      };
    });
    newFilteredCategorizedInstallments && this.filteredCategorizedInstallments.set(newFilteredCategorizedInstallments);
  }

  private setFilteredCategorizedInstallments() {
    const filtered = this.categorizedInstallments().filter((category) => {
      const now = +new Date();
      return this.checkDateInFilter(category.dueDate, now);
    });
    const filteredCopy: InstallmentsOverviewBnplList = filtered.map((category) => {
      const newInstallments = category.installments.map((installment) => {
        return {
          ...installment,
          checked: signal(installment.isDue),
        };
      });
      return {
        dueDate: category.dueDate,
        installments: newInstallments,
      };
    });
    this.filteredCategorizedInstallments.set(filteredCopy);
    this.filteredCategorizedInstallments.update((prev) => {
      return prev!.map((category) => {
        const newInstallments = category.installments.map((ins) => {
          return {
            ...ins,
            checked: signal(ins.isDue && this.canCheckInstallment(ins.contractTrackingCode, ins.order)),
          };
        });
        return {
          ...category,
          installments: newInstallments,
        };
      });
    });
  }

  private checkDateInFilter(dueDate: number, now: number): boolean {
    if (this.dateFilters().all) {
      return true;
    }
    if (this.dateFilters().currentMonth) {
      const startOfCurrentMonth = moment(now).locale('fa').startOf('month');
      const endOfCurrentMonth = moment(now).locale('fa').endOf('month');
      const dueDateInMoment = moment(dueDate).locale('fa');
      return dueDateInMoment.isBetween(startOfCurrentMonth, endOfCurrentMonth);
    }
    if (this.dateFilters().future) {
      const endOfCurrentMonth = moment(now).locale('fa').endOf('month');
      const dueDateInMoment = moment(dueDate).locale('fa');
      return dueDateInMoment.isAfter(endOfCurrentMonth);
    }
    return false;
  }

  onDateFiltersChange(event: boolean, dateFilterType: keyof DateFilters) {
    if (event) {
      const newFilter = { ...this.emptyDateFilter };
      newFilter[dateFilterType] = true;
      this.dateFilters.set(newFilter);
      this.setFilteredCategorizedInstallments();
      this.scanCheckAll();
      this.calculateSelectedAmounts();
    }
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

  onCheckChange(toCheck: boolean, contractTrackingCode: string, installmentOrder: number) {
    this.scanCheckPrecedence(toCheck, contractTrackingCode, installmentOrder);
    this.scanCheckAll();
    setTimeout(() => {
      this.calculateSelectedAmounts();
    });
  }

  private changeAllInstallments(toCheck: boolean) {
    if (this.dateFilters().all || !toCheck) {
      this.filteredCategorizedInstallments.update((categories) => {
        return categories!.map((category) => {
          const newInstallments = category.installments.map((installment) => ({ ...installment, checked: signal(toCheck) }));
          return {
            ...category,
            installments: newInstallments,
          };
        });
      });
    } else {
      this.filteredCategorizedInstallments.update((categories) => {
        return categories!.map((category) => {
          const newInstallments = category.installments.map((installment) => ({
            ...installment,
            checked: signal(this.canCheckInstallment(installment.contractTrackingCode, installment.order)),
          }));
          return {
            ...category,
            installments: newInstallments,
          };
        });
      });
      this.scanCheckAll();
    }
  }

  private canCheckInstallment(contractTrackingCode: string, installmentOrder: number): boolean {
    let canCheck = false;
    if (installmentOrder === 1) {
      canCheck = true;
    } else {
      const prevOrder = installmentOrder - 1;
      const isPreviousInstallmentUnpaid = this.categorizedInstallments().find((c) => {
        return c.installments.find((ins) => ins.order === prevOrder && ins.contractTrackingCode === contractTrackingCode);
      });

      if (isPreviousInstallmentUnpaid) {
        const prevInstallmentExistInFiltered = this.filteredCategorizedInstallments()!.find((c) => {
          return c.installments.find((ins) => ins.order === prevOrder && ins.contractTrackingCode === contractTrackingCode);
        });
        if (prevInstallmentExistInFiltered) {
          canCheck = prevInstallmentExistInFiltered.installments.find((ins) => ins.order === prevOrder)!.checked();
        } else {
          canCheck = false;
        }
      } else {
        canCheck = true;
      }
    }
    return canCheck;
  }

  private scanCheckPrecedence(toCheck: boolean, contractTrackingCode: string, installmentOrder: number) {
    if (toCheck) {
      const canCheck = this.canCheckInstallment(contractTrackingCode, installmentOrder);

      if (canCheck) {
        return;
      } else {
        setTimeout(() => {
          let installmentIndex = -1;
          const categoryIndex = this.filteredCategorizedInstallments()!.findIndex((category) => {
            installmentIndex = category.installments.findIndex(
              (ins) => ins.order === installmentOrder && ins.contractTrackingCode === contractTrackingCode,
            );
            return installmentIndex > -1;
          });
          this.filteredCategorizedInstallments()![categoryIndex].installments[installmentIndex].checked.set(false);
          if (!this.dateFilters().all) {
            this.scanCheckAll();
          }
        }, 0);

        this.messageService.showErrorMessage('اولویت پرداخت اقساط بالاتر بیشتر است. لطفا این اولویت‌بندی را در انتخاب آن‌ها رعایت کنید.');
      }
    } else {
      const laterUnchecked = this.filteredCategorizedInstallments()!.map((category) => {
        const newInstallments = category.installments.map((ins) => {
          if (ins.order >= installmentOrder && ins.contractTrackingCode === contractTrackingCode) {
            return {
              ...ins,
              checked: signal(false),
            };
          } else {
            return ins;
          }
        });
        return {
          ...category,
          installments: newInstallments,
        };
      });
      this.filteredCategorizedInstallments.set(laterUnchecked);
    }
  }

  private scanCheckAll() {
    const unCheckExists = this.filteredCategorizedInstallments()!.some((category) => {
      return category.installments.some((installment) => !installment.checked());
    });
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
    this.filteredCategorizedInstallments()!.forEach((categorizedInstallment) => {
      categorizedInstallment.installments.forEach((installment) => {
        if (installment.checked()) {
          totalPayable += installment.amount;
          totalPenalty += installment.penalty;
          totalPenaltyWaiver += installment.penaltyWaiverAmount;
          totalFee += installment.fee;
        }
      });
    });
    this.selectedAmounts.set({
      payable: totalPayable,
      penalty: totalPenalty,
      penaltyWaiver: totalPenaltyWaiver,
      fee: totalFee,
    });
  }

  makePaymentFooterRows() {
    if (this.selectedAmounts().penalty || this.selectedAmounts().fee) {
      const rows: CreditInstallmentPaymentFooterRow[] = [
        {
          title: 'جمع اقساط انتخاب شده',
          value:
            this.selectedAmounts().payable -
            this.selectedAmounts().penalty +
            this.selectedAmounts().penaltyWaiver -
            this.selectedAmounts().fee,
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
    const aggregateDataForTicket: AggregationInstallmentFields[] = [];
    this.filteredCategorizedInstallments()!.forEach((category) => {
      category.installments.forEach((installment) => {
        if (installment.checked()) {
          const existContractIndex = aggregateDataForTicket.findIndex((item) => item.trackingCode === installment.contractTrackingCode);
          if (existContractIndex < 0) {
            aggregateDataForTicket.push({
              trackingCode: installment.contractTrackingCode,
              count: 1,
              amount: installment.amount,
            });
          } else {
            ++aggregateDataForTicket[existContractIndex].count;
            aggregateDataForTicket[existContractIndex].amount += installment.amount;
          }
        }
      });
    });
    this.pay(aggregateDataForTicket);
  }

  pay(aggregateDataForTicket: AggregationInstallmentFields[]) {
    if (this.selectedAmounts().payable > this.paymentMaxLimitAmount()) {
      return this.creditInstallmentPaymentService.outOfRangeAmountHandler();
    }
    const sourceUrl = this.sourceUrlService.sourceUrl();
    if (this.paymentFlow() === ConfigPaymentFlow.internal) {
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
    if (this.paymentFlow() === ConfigPaymentFlow.external) {
      this.creditInstallmentPaymentService.externalFlowPay(
        {
          aggregateTicketDto: {
            ticketRequestDetails: aggregateDataForTicket,
          },
          amount: this.selectedAmounts().payable,
        },
        this.selectedAmounts().payable,
        this.creditUrlService.getPaymentTicketCallbackUrl(
          CreditTransactionCallbackType.installmentsOverview,
          sourceUrl ? `?${CallbackInstallmentsOverviewKey}=${sourceUrl}` : '',
        ),
      );
    }
  }

  showPurchaseDetails(contractTrackingCode: string, billingCycleInfo?: Omit<BillingCycleInfo, 'merchantsBusinessIds'>) {
    this.bottomSheet.openBottomSheet(
      InstallmentsOverviewPurchaseDetailsComponent,
      {
        contractTrackingCode,
        billingCycleInfo,
      },
      {
        noPadding: true,
        maxHeight: '90vh',
      },
    );
  }

  emptyInstallmentsActionHandler() {
    this.router.navigate(['stores']);
  }

  bnplNotFoundActionHandler() {
    this.router.navigate(['service/bnpl/pre-register'], {
      queryParams: {
        step: 'Plan',
      },
    });
  }
}
