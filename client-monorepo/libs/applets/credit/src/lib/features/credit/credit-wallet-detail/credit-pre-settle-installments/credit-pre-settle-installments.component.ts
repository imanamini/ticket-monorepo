import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AggregationInstallmentFields, Installment } from '../../data-access/models/credit/installment/installment';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import {
  CheckedChangeEvent,
  CreditInstallmentItemSelectComponent,
} from '../credit-installment-item-select/credit-installment-item-select.component';
import { MessageService } from '../../data-access/services/message.service';
import { CreditInstallmentPaymentService } from '../../data-access/services/credit-installment-payment.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CreditInstallmentItemComponent } from '../credit-installment-item/credit-installment-item.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTabComponent, NgxTabsComponent, tabState } from '@digipay/ngx-tabs';

interface CreditPreSettleInstallmentsResult {
  data: AggregationInstallmentFields[];
  options: {
    needConfirm: boolean;
  };
}

export enum TabEnum {
  Some,
  All,
}

@Component({
  selector: 'app-credit-pre-settle-installments',
  templateUrl: './credit-pre-settle-installments.component.html',
  styleUrls: ['./credit-pre-settle-installments.component.scss'],
  standalone: true,
  imports: [
    CreditInstallmentItemSelectComponent,
    CreditInstallmentItemComponent,
    NgxButtonComponent,
    PipesModule,
    NgxIcon,
    NgxTabComponent,
    NgxTabsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPreSettleInstallmentsComponent implements OnInit {
  data = signal<ContractInstallmentSummary | undefined>(undefined);

  installments = signal<Installment[]>([]);
  installmentsStates = signal<Record<string, boolean>>({});
  nextInstallmentTabLabel = signal<string>('');
  payableAmount = signal<number | undefined>(undefined);
  selectedTabIndex = signal(TabEnum.Some);
  DueInstallmentExists = signal(false);
  maxPaymentAmount?: number;

  TabEnum = TabEnum;
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);
  installmentPaymentService = inject(CreditInstallmentPaymentService);

  ngOnInit(): void {
    this.data.set(this.bottomSheetService.data().contractInstallmentSummary);
    this.maxPaymentAmount = this.bottomSheetService.data().maxPaymentAmount;

    this.setInstallments();
    this.setInstallmentStates();
    this.calculatedPayableAmount(this.selectedTabIndex());
  }

  setInstallments() {
    const dueInstallmentGroup = this.data()!.installmentGroups.find((item) => item.payable && item.installments!.length! > 0);

    if (dueInstallmentGroup) {
      this.nextInstallmentTabLabel.set('سررسید شده');
      this.DueInstallmentExists.set(true);
      dueInstallmentGroup.installments!.sort((a, b) => a.date - b.date);
      this.installments.set(dueInstallmentGroup.installments!);
      return;
    }

    this.nextInstallmentTabLabel.set('قسط بعدی');

    const remainedInstallmentGroup = this.data()!.installmentGroups.find(
      (item) => !item.payable && !item.installments?.some((installment) => installment.trackingCode),
    );

    if (remainedInstallmentGroup) {
      remainedInstallmentGroup.installments?.sort((a, b) => a.date - b.date);
      this.installments.set(remainedInstallmentGroup.installments!.slice(0, 1)!);
      return;
    }
  }

  setInstallmentStates() {
    if (this.installments() && Array.isArray(this.installments())) {
      if (this.installments().length === 1) {
        this.installmentsStates.update((state) => ({ ...state, [this.installments()[0].order]: true }));
      } else {
        this.installments().forEach((item) => {
          this.installmentsStates.update((state) => ({ ...state, [item.order]: false }));
        });
      }
    } else {
      console.error('this.installments is undefined or not an array');
    }
  }

  onCheckedChange($event: CheckedChangeEvent) {
    this.installmentsStates.update((state) => ({ ...state, [$event.id]: $event.value }));
    if (!$event.value) {
      this.uncheckNextInstallments($event.id);
    }
    this.calculatedPayableAmount(this.selectedTabIndex());
  }

  uncheckNextInstallments(currentId: string) {
    for (const id in this.installmentsStates()) {
      if (id > currentId && this.installmentsStates()[id]) {
        this.installmentsStates.update((state) => ({ ...state, [id]: false }));
      }
    }
  }

  calculatedPayableAmount(tabIndex: TabEnum, tabState?: tabState) {
    if (tabState === 'enabled') {
      return;
    }
    this.selectedTabIndex.set(tabIndex);
    if (tabIndex === TabEnum.All) {
      this.payableAmount.set(this.data()!.clearAmount);
    } else {
      let amount = 0;
      for (const item in this.installmentsStates()) {
        if (this.installmentsStates()[item]) {
          amount += this.findInstallmentByState(+item)!.totalAmount!;
        }
      }
      this.payableAmount.set(amount);
    }
  }

  getTotalCheckedCount(): number {
    let totalCheckedCount = 0;
    for (const item in this.installmentsStates()) {
      if (this.installmentsStates()[item]) {
        ++totalCheckedCount;
      }
    }
    return totalCheckedCount;
  }

  findInstallmentByState(state: number) {
    return this.installments().find((item) => item.order === state);
  }

  onLocked() {
    this.messageService.showErrorMessage('ابتدا اقساط قبلی خود را انتخاب نمایید.');
  }

  onActionClick() {
    if (this.maxPaymentAmount && this.maxPaymentAmount < this.data()!.clearAmount && this.payableAmount()! > this.maxPaymentAmount) {
      return this.installmentPaymentService.outOfRangeAmountHandler();
    }

    const clear = this.selectedTabIndex() === TabEnum.All || this.payableAmount()! >= this.data()!.clearAmount;
    const result: CreditPreSettleInstallmentsResult = {
      data: [
        {
          trackingCode: this.data()!.contractTrackingCode,
          count: clear ? 1 : this.getTotalCheckedCount(),
          amount: clear ? this.data()!.clearAmount : this.payableAmount()!,
          clear,
        },
      ],
      options: {
        needConfirm: this.selectedTabIndex() === TabEnum.All,
      },
    };
    this.bottomSheetService.outputData.set(result);
    this.dismissDialog();
  }

  dismissDialog(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
