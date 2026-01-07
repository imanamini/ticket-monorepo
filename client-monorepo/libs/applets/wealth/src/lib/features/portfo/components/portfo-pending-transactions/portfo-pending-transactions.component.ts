import { NgxAlert } from '@digipay/ngx-alert';
import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { ITransaction_V2 } from '../../../../data-access/models/transaction.model';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { PendingTransactionCardComponent } from '../pending-transaction-card/pending-transaction-card.component';
import { PendingTransactionEmptyComponent } from '../pending-transaction-empty/pending-transaction-empty.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DecimalPipe, NgClass, SlicePipe } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'wealth-applet-portfo-pending-transactions',
  standalone: true,
  imports: [
    NgxButtonComponent,
    NgxSegmentedControlComponent,
    NgxAlert,
    PendingTransactionCardComponent,
    PendingTransactionEmptyComponent,
    PipesModule,
    DecimalPipe,
    SpinnerComponent,
    NgClass,
    NgxDividerComponent,
    SlicePipe,
  ],
  templateUrl: './portfo-pending-transactions.component.html',
  styleUrl: './portfo-pending-transactions.component.scss',
})
export class PortfoPendingTransactionsComponent implements OnInit {
  canSee = input<boolean>();
  transactions = input<ITransaction_V2[]>();
  type = input<string>();
  totalUnits = input<number>();
  totalAmount = input<number>();
  loadingTransactions = input<boolean>(true);
  activeSegment = signal<number | string>('Buy');
  state = input<string>();
  options = signal<SegmentItemsModel[]>([]);

  goToTransactions = output<void>();
  updateFilter = output<SegmentItemsModel>();

  alertText = computed<string>(() => {
    switch (this.activeSegment()) {
      case 'Sell':
        return 'این واحد‌ها در کل دارایی شما محاسبه می‌شود.';
      default:
        return 'این مبالغ در کل دارایی شما محاسبه نمی‌شود.';
    }
  });

  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit() {
    this.options.set([
      { text: 'خرید', id: 'Buy', value: 'BUY_TRANSACTION', disable: false },
      { text: 'فروش', id: 'Sell', value: 'SELL_TRANSACTION', disable: false },
      { text: 'برداشت', id: 'EtfWalletWithdrawal', value: 'CASH_OUT', disable: false },
    ]);
  }

  goToTransactionsHandler() {
    this.goToTransactions.emit();
  }

  updateFilterHandler(segmentValue: SegmentItemsModel) {
    this.updateFilter.emit(segmentValue);
  }
}
