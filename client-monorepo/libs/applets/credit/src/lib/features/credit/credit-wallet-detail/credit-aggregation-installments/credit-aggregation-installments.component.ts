import { Component, inject, OnInit, signal } from '@angular/core';
import { AggregationInstallmentFields, Installment } from '../../data-access/models/credit/installment/installment';
import { MessageService } from '../../data-access/services/message.service';
import { CreditInstallmentPaymentService } from '../../data-access/services/credit-installment-payment.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditAggregationBottomComponent } from '../credit-aggregation-bottom/credit-aggregation-bottom.component';
import { CreditInstallmentItemComponent } from '../credit-installment-item/credit-installment-item.component';
import {
  CreditCheckboxComponent
} from '../../components/credit-checkbox/credit-checkbox.component';
import { NgClass } from '@angular/common';
import {
  CreditScrollableViewComponent
} from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxButtonComponent } from '@digipay/ngx-button';

export type AggregationPayableInstallments = {
  trackingCode: string;
  installments?: Installment[];
};

interface AggregationImportedData {
  contracts: AggregationPayableInstallments[];
  fundProviderCode: number;
  totalInstallmentCount: number;
  maxLimitAmount: number;
}

@Component({
  selector: 'app-credit-aggregation-installments',
  templateUrl: './credit-aggregation-installments.component.html',
  styleUrls: ['./credit-aggregation-installments.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    CreditScrollableViewComponent,
    NgClass,
    CreditCheckboxComponent,
    CreditInstallmentItemComponent,
    CreditAggregationBottomComponent,
  ],
})
export class CreditAggregationInstallmentsComponent implements OnInit {
  totalAmount = signal<number | null>(null);
  installmentStates = signal<Record<string, boolean>>({});

  data!: AggregationImportedData;
  installments = signal<Installment[] | null>(null);
  bottomSheetService = inject(NgxBottomSheetService);

  constructor(
    private messageService: MessageService,
    private installmentPaymentService: CreditInstallmentPaymentService,
  ) {}

  ngOnInit(): void {
    this.data = this.bottomSheetService.data();
    this.makeInstallments(this.data.contracts);
    this.sortByDate();
    this.makeInstallmentStates();
    this.totalAmount.set(this.calculateTotalAmount());
  }

  makeInstallments(data: AggregationPayableInstallments[]) {
    this.installments.set(
      data.reduce<Installment[]>((prev, cur, index) => {
        cur.installments?.forEach((installment) => {
          prev.push({ ...installment, trackingCode: cur.trackingCode });
        });
        return prev;
      }, []),
    );
  }

  sortByDate() {
    // this causes to hoist installments with penalty
    this.installments.update((installments) => installments?.sort((a, b) => a.date - b.date)!);
  }

  makeInstallmentStates() {
    this.installments()?.forEach((item) => {
      const key = item.trackingCode + item.order;
      this.installmentStates.update((item) => ({ ...item, [key]: true }));
    });
  }

  calculateTotalAmount() {
    let totalAmount = 0;
    this.installments()?.forEach((item) => {
      const key = item.trackingCode + item.order;
      if (this.installmentStates()[key]) {
        totalAmount += item.totalAmount;
      }
    });
    return totalAmount;
  }

  handleCheckbox(event: boolean, installment: Installment) {
    const key = installment.trackingCode + installment.order;
    this.installmentStates.update((item) => ({ ...item, [key]: event }));
    this.totalAmount.set(this.calculateTotalAmount());
  }

  handleLockedClick() {
    this.messageService.showWarnMessage('بازپرداخت بدهی‌های دارای جریمه الزامی‌ست');
  }

  onSubmit() {
    const mappedContracts: AggregationInstallmentFields[] = this.data.contracts.map((contract) => {
      let count = 0;
      let amount = 0;
      contract.installments?.forEach((item) => {
        const key = contract.trackingCode + item.order;
        if (this.installmentStates()[key]) {
          ++count;
          amount += item.totalAmount;
        }
      });
      return {
        trackingCode: contract.trackingCode,
        count,
        amount,
      };
    });

    const totalAmount = mappedContracts.reduce((prev, current) => {
      prev += current.amount;
      return prev;
    }, 0);
    if (totalAmount > this.data.maxLimitAmount) {
      return this.installmentPaymentService.outOfRangeAmountHandler();
    }
    const mappedContractsStringified = JSON.stringify(mappedContracts);
    this.bottomSheetService.outputData.set(mappedContractsStringified);
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
