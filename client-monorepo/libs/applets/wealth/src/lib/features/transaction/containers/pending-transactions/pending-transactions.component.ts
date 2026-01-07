import { Component, inject, OnInit, signal } from '@angular/core';

import { ITransaction_V2 } from '../../../../data-access/models/transaction.model';
import { ActivatedRoute, Params } from '@angular/router';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { TransactionService } from '../../../../components/core/services/transaction.service';
import { PENDING_TRANSACTIONS_ROUTE, PORTFO } from '../../../../data-access/constants/app-routes';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { PendingTransactionCardComponent } from '../../../portfo/components/pending-transaction-card/pending-transaction-card.component';
import { PendingTransactionEmptyComponent } from '../../../portfo/components/pending-transaction-empty/pending-transaction-empty.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { switchMap } from 'rxjs';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DecimalPipe, NgClass } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'wealth-applet-pending-transactions',
  standalone: true,
  imports: [
    NgxAlert,
    PipesModule,
    NgxAppBarComponent,
    NgxSegmentedControlComponent,
    PendingTransactionCardComponent,
    PendingTransactionEmptyComponent,
    DecimalPipe,
    SpinnerComponent,
    NgClass,
    NgxDividerComponent,
  ],
  templateUrl: './pending-transactions.component.html',
  styleUrl: './pending-transactions.component.scss',
})
export class PendingTransactionsComponent extends BaseComponent implements OnInit {
  loadingTransactions = signal<boolean>(true);
  transactions = signal<ITransaction_V2[]>([]);
  qParams = signal<Params | undefined>(undefined);
  activeSegment = signal<number | string>('Buy');
  state = signal<string>('BUY_TRANSACTION');
  totalAmount = signal<number>(0);
  totalUnits = signal<number>(0);
  page = signal<number>(1);
  activeSegmentIndex = signal<number>(0);

  private activatedRoute = inject(ActivatedRoute);
  private transactionService = inject(TransactionService);
  private navigationService = inject(WealthNavigationService);
  protected readonly BorderColorsEnum = BorderColorsEnum;

  options: SegmentItemsModel[] = [
    { text: 'خرید', id: 'Buy', value: 'BUY_TRANSACTION', disable: false },
    { text: 'فروش', id: 'Sell', value: 'SELL_TRANSACTION', disable: false },
    { text: 'برداشت', id: 'EtfWalletWithdrawal', value: 'CASH_OUT', disable: false },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((qparams) => {
          this.loadingTransactions.set(true);
          this.qParams.set(qparams);
          const foundSegment = this.options.find((segment) => segment.id === this.qParams()['type']);
          this.activeSegment.set(foundSegment ? foundSegment.id : '');
          this.activeSegmentIndex.set(this.options.findIndex((segment) => segment.id === this.qParams()['type']));
          const segment = this.options.find((segment) => segment.id === this.qParams()['type']);
          if (segment) {
            this.state.set(segment.value.toString());
          } else {
            console.log('No segment found with id:', this.qParams()['type']);
          }
          return this.transactionService.getRecentOrders(this.page(), qparams);
        }),
      )
      .subscribe((res) => {
        if (res?.success) {
          this.transactions.set(res.result.details);
          this.totalAmount.set(this.transactions().reduce((total, transaction) => total + transaction.amount, 0));
          this.totalUnits.set(this.transactions().reduce((total, transaction) => total + transaction.units, 0));
        }

        this.loadingTransactions.set(false);
      });
  }

  onBackHandler() {
    this.navigationService.navigate([PORTFO]);
  }

  updateFilter(segmentValue: SegmentItemsModel) {
    this.navigationService.navigate([PENDING_TRANSACTIONS_ROUTE], {
      queryParams: {
        status: ['Waiting', 'Draft'],
        type: segmentValue.id.toString(),
        count: 20,
      },
    });
  }
}
