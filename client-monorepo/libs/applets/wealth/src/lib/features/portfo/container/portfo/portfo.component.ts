import { Component, inject, OnInit, signal } from '@angular/core';
import { PortfoAssetsComponent } from '../../components/portfo-assets/portfo-assets.component';
import { PortfoEtfComponent } from '../../components/portfo-etf/portfo-etf.component';
import { takeUntil } from 'rxjs';

import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { HOME_ROUTE, PENDING_TRANSACTIONS_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PortfoPendingTransactionsComponent } from '../../components/portfo-pending-transactions/portfo-pending-transactions.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { Params } from '@angular/router';
import { TransactionService } from '../../../../components/core/services/transaction.service';
import { ITransaction_V2 } from '../../../../data-access/models/transaction.model';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { IPortfolios } from '../../../../components/core/models/customer-schemas/portfolio.interface';

@Component({
  selector: 'app-portfo',
  standalone: true,
  imports: [PortfoEtfComponent, PortfoAssetsComponent, PortfoPendingTransactionsComponent, SpinnerComponent, AppBarWrapperComponent],
  templateUrl: './portfo.component.html',
  styleUrl: './portfo.component.scss',
})
export class PortfoComponent extends BaseComponent implements OnInit {
  canSee = signal(true);
  loading = signal(false); // TODO: update it to true in initial

  portfolios = signal<IPortfolios | undefined>(undefined);
  walletBalance = signal(null);
  canWithdraw = signal<boolean>(false);
  assetBalance = signal<number>(0);
  crowdBalance = signal<number>(0);
  ipoBalance = signal<number>(0);
  stockBalance = signal<number>(0);
  pageNumber = signal<number>(1);
  type = signal<string>('Buy');
  totalAmount = signal<number>(0);
  totalUnits = signal<number>(0);
  transactions = signal<ITransaction_V2[]>([]);
  loadingTransactions = signal<boolean>(true);
  state = signal<string>('BUY_TRANSACTION');
  filteredTransactions = signal<ITransaction_V2[]>([]);

  private fundDataService = inject(FundDataService);
  private customerService = inject(CustomerService);
  private transactionService = inject(TransactionService);
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    const params: Params = { type: this.type() };
    this.getFund();
    this.getWalletBalance();
    this.getTransactions(params);
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  getFund() {
    this.loading.set(true);
    this.customerService.getPortfolios().subscribe((portfolios) => {
      if (portfolios.success) {
        this.portfolios.set(portfolios.result);
      }
      this.loading.set(false);
    });
  }

  getWalletBalance() {
    this.fundDataService
      .getWalletBalance()
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res.result !== null) {
          this.walletBalance.set(res.result?.amount);
          this.canWithdraw.set(res.result?.canWithdraw);
        } else {
          this.walletBalance.set(res.result);
        }
      });
  }

  private getTransactions(params: Params) {
    this.transactionService
      .getRecentOrders(this.pageNumber(), params)
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res?.success) {
          this.transactions.set(res.result.details);
          if (this.type() === 'Sell') {
            this.totalUnits.set(this.transactions().reduce((total, transaction) => total + transaction.units, 0));
          } else {
            this.totalAmount.set(this.transactions().reduce((total, transaction) => total + transaction.amount, 0));
          }
        }
        this.loadingTransactions.set(false);
      });
  }

  updateFilter(segmentValue: SegmentItemsModel) {
    if (segmentValue.value != this.state()) {
      this.loadingTransactions.set(true);
      this.state.set(segmentValue.value.toString());
      this.totalAmount.set(this.filteredTransactions().reduce((total, transaction) => total + transaction.amount, 0));
      this.type.set(segmentValue.id.toString());
      const params: Params = { type: this.type() };
      this.getTransactions(params);
    }
  }

  goToTransactions() {
    this.navigationService.navigate([PENDING_TRANSACTIONS_ROUTE], {
      queryParams: {
        status: ['Waiting', 'Draft'],
        type: this.type(),
      },
    });
  }
}
