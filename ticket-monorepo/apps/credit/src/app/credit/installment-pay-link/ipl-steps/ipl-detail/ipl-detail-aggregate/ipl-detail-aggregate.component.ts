import { Component, computed, inject, output, signal, WritableSignal } from '@angular/core';
import {
  CreditInstallmentPaymentFooterComponent
} from '../../../components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { IplDetailService } from '../../../services/ipl-detail/ipl-detail.service';
import { IplService } from '../../../services/ipl.service';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import {
  CreditInstallmentCardComponent
} from '../../../components/credit-installment-card/credit-installment-card.component';
import { orderToLetters } from '../../../../../utils/strings';
import { getMonthTitle, getYear } from '../../../../../utils/date';
import { MessageService } from '../../../../core/services/message.service';
import { RegisterIplTicketDetail } from '../../../../api/installment-pay-link/register-ipl-ticket';
import {
  CreditInstallmentPaymentFooterRow
} from '../../../components/credit-installment-payment-footer/data-access/credit-installment-payment-footer-row';
import { DebtorInfoComponent } from '../debtor-info/debtor-info.component';
import { NgxNoticeService } from '@digipay/ngx-notice';
import { IplDigipayEnglishName } from '../../../data-access/ipl-digipay-english-name';

interface SerializeInstallment {
  checked: WritableSignal<boolean>;
  title: string;
  badge?: 'penalty' | 'penaltyWaiver' | 'settled';
  dateTitle: string;
  initialAmount: number;
  penaltyAmount: number;
  penaltyWaiverAmount: number;
  order: number;
  contractTrackingCode: string;
  deActive?: boolean;
}

interface FooterAmounts {
  payable: number;
  penalty: number;
  penaltyWaiver: number;
  clearDiscount: number;
}

@Component({
  selector: 'app-ipl-detail-aggregate',
  standalone: true,
  imports: [
    NgxCheckboxComponent,
    CreditInstallmentPaymentFooterComponent,
    CreditInstallmentCardComponent,
    DebtorInfoComponent,
  ],
  templateUrl: './ipl-detail-aggregate.component.html',
  styleUrl: './ipl-detail-aggregate.component.scss'
})
export class IplDetailAggregateComponent {

  checkAll = signal(false);
  serializedInstallments = signal<SerializeInstallment[]>([]);
  selectedAmounts = signal<FooterAmounts>({
    payable: 0,
    penalty: 0,
    penaltyWaiver: 0,
    clearDiscount: 0,
  });
  hideFooter = signal(true);
  paymentFooterRows = computed<CreditInstallmentPaymentFooterRow[]>(() => this.makePaymentFooterRows());

  // Outputs
  payClicked = output();

  // Services
  private iplDetailService = inject(IplDetailService);
  private iplService = inject(IplService);
  private noticeService = inject(NgxNoticeService);
  private messageService = inject(MessageService);

  // Signals
  userInfo = signal(this.iplService.userInfo());
  debtorInfoTitle = computed(() => {
    return this.userInfo().fundProviderDto.name === IplDigipayEnglishName ?
      'بدهی اعتبار اقساطی ' :
      this.userInfo().fundProviderDto.title.replace('اعتبار', 'وام');
  });

  constructor() {
    this.serializedInstallments.set(this.serializeInstallments());
    this.handleIfUserHasSelectedBefore();
    this.scanCheckAll();
    this.calculateSelectedAmounts();
  }

  handleIfUserHasSelectedBefore() {
    if (this.iplDetailService.selectedInstallments()) {
      this.serializedInstallments.update(prev => {
        return prev.map(serializedInstallment =>
          ({
            ...serializedInstallment,
            checked: signal(this.iplDetailService.selectedInstallments()[serializedInstallment.order])
          })
        );
      });
    }
  }

  onCheckAllChange(toCheck: unknown) {
    if (typeof toCheck === 'boolean') {
      if (toCheck) {
        this.changeAllInstallments(true);
      } else {
        this.changeAllInstallments(false);
      }
    }
    this.calculateSelectedAmounts();
  }

  deActiveClickHandler() {
    const maxPayableInstallmentOrder =
      this.serializeInstallments()[0].order +
      this.userInfo().unPaidInstallments[0].payableInstallmentsLimit - 1;
    this.noticeService.openModal({
      state: 'warning',
      title: 'محدودیت تعداد اقساط',
      description: `ابتدا تا قسط ${maxPayableInstallmentOrder} را پرداخت کرده و بعد از تراکنش موفق، برای پرداخت باقی اقساط اقدام فرمایید.`,
      primaryButtonLabel: 'متوجه شدم',
    });
  }

  onCheckChange(toCheck: boolean, index: number) {
    this.scanCheckPrecedence(toCheck, index);
    this.scanCheckAll();
    setTimeout(() => {
      this.calculateSelectedAmounts();
    });
  }

  onFooterPaymentClick() {
    const selectedInstallments = this.serializedInstallments().filter((installment) => installment.checked());

    if (selectedInstallments.length && selectedInstallments.length > 0) {
      const selectedInstallmentsObject = selectedInstallments.reduce((prev, cur) => {
        prev[cur.order] = true;
        return prev;
      }, {});

      this.iplDetailService.setSelectedInstallments(selectedInstallmentsObject);

      // It is sufficient for one contract;
      const details: RegisterIplTicketDetail[] = selectedInstallments.reduce<RegisterIplTicketDetail[]>((prev, cur, index) => {
        if (index < 1) {
          prev.push({
            trackingCode: cur.contractTrackingCode,
            amount: cur.initialAmount + cur.penaltyAmount - cur.penaltyWaiverAmount,
            count: 1,
            clear: false,
          });
        } else {
          prev[0].amount += cur.initialAmount + cur.penaltyAmount - cur.penaltyWaiverAmount;
          prev[0].count += 1;
        }
        return prev;
      }, []);

      const isClear = this.userInfo().clearAmount ? details[0].amount >= this.userInfo().clearAmount : false;

      if (isClear) {
        this.handleClear(details);
      }

      this.setTicketDetailsAndGo(details);
    }
  }

  handleClear(details: RegisterIplTicketDetail[]) {
    details[0].clear = true;
    details[0].count = 1;
    details[0].amount = this.userInfo().clearAmount;
  }

  setTicketDetailsAndGo(details: RegisterIplTicketDetail[]) {
    this.iplDetailService.setRegisterIplTicketDetails(details);
    this.payClicked.emit();
  }

  makePaymentFooterRows(): CreditInstallmentPaymentFooterRow[] {
    if (this.selectedAmounts().penalty) {
      const rows: CreditInstallmentPaymentFooterRow[] = [
        {
          title: 'جمع اقساط انتخاب شده',
          value:
            this.selectedAmounts().payable -
            this.selectedAmounts().penalty +
            this.selectedAmounts().penaltyWaiver +
            this.selectedAmounts().clearDiscount,
          status: 'default',
        },
        {
          title: 'جریمه دیرکرد',
          value: this.selectedAmounts().penalty,
          status: 'increase',
        }
      ];

      if (this.selectedAmounts().penaltyWaiver) {
        rows.push({
          title: 'بخشش جریمه',
          value: this.selectedAmounts().penaltyWaiver,
          status: 'decrease',
        });
      }

      if (this.selectedAmounts().clearDiscount) {
        rows.push({
          title: 'تخفیف تسویه کامل',
          value: this.selectedAmounts().clearDiscount,
          status: 'decrease',
        });
      }

      return rows;
    } else {
      return [];
    }
  }

  private serializeInstallments(): SerializeInstallment[] {
    const payableInstallmentsLimit = this.userInfo().unPaidInstallments[0].payableInstallmentsLimit;
    return this.userInfo().unPaidInstallments.sort((a, b) => (a.order - b.order))
      .map<SerializeInstallment>((installment, index) => {
        const deActive = Number.isInteger(payableInstallmentsLimit) && (index + 1) > payableInstallmentsLimit;
        const badge: SerializeInstallment['badge'] = installment.penaltyWaiverAmount > 0 ? 'penaltyWaiver' : installment.penaltyAmount > 0 ? 'penalty' : undefined;
        const due = +new Date() >= installment.effectiveDate;
        return {
          checked: signal(!deActive && due),
          title: 'قسط ' + orderToLetters(installment.order),
          badge,
          dateTitle: 'سررسید ' + getMonthTitle(installment.effectiveDate, true) + ' ' + getYear(installment.effectiveDate),
          initialAmount: installment.amount - installment.penaltyAmount + installment.penaltyWaiverAmount,
          penaltyAmount: installment.penaltyAmount,
          penaltyWaiverAmount: installment.penaltyWaiverAmount,
          order: installment.order,
          contractTrackingCode: installment.contractTrackingCode,
          deActive,
        };
      });
  }

  private changeAllInstallments(toCheck: boolean) {
    this.serializedInstallments.update(installments => {
      return installments.map(installment => ({...installment, checked: signal(toCheck)}));
    });
  }

  private scanCheckPrecedence(toCheck: boolean, index: number) {
    if (toCheck) {
      const canCheck =
        index === 0 || this.serializedInstallments()[index - 1].checked();
      if (canCheck) {
        return;
      } else {
        setTimeout(() => {
          this.serializedInstallments()[index].checked.set(false);
        }, 0);

        this.messageService.showErrorMessage('اولویت پرداخت اقساط بالاتر بیشتر است. لطفا این اولویت‌بندی را در انتخاب آن‌ها رعایت کنید.');
      }
    } else {
      const uncheckedLaterInstallments = this.serializedInstallments().map((installment, installmentIndex) => {
        if (installmentIndex >= index) {
          return {...installment, checked: signal(false)};
        } else {
          return {...installment};
        }
      });
      this.serializedInstallments.set(uncheckedLaterInstallments);
    }
  }

  private scanCheckAll() {
    const unCheckExists = this.serializedInstallments().some(installment => !installment.checked());
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
    const selectedInstallments = this.serializedInstallments().filter((installment) => installment.checked());
    selectedInstallments.forEach((installment) => {
      totalPayable += installment.initialAmount + installment.penaltyAmount - installment.penaltyWaiverAmount;
      totalPenalty += installment.penaltyAmount;
      totalPenaltyWaiver += installment.penaltyWaiverAmount;
    });
    if (totalPayable <= 0) {
      this.hideFooter.set(true);
    } else {
      this.hideFooter.set(false);
      const isClear = this.userInfo().clearAmount ? totalPayable >= this.userInfo().clearAmount : false;
      const clearDiscount = isClear ? totalPayable - this.userInfo().clearAmount : 0;
      totalPayable = isClear ? this.userInfo().clearAmount : totalPayable;
      this.selectedAmounts.set({
        payable: totalPayable,
        penalty: totalPenalty,
        penaltyWaiver: totalPenaltyWaiver,
        clearDiscount,
      });
    }
  }
}
