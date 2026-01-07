import { takeUntil } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingTRXComponent } from '../../components/loading-trx/loading-trx.component';

import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { ITransaction_V2 } from '../../../../data-access/models/transaction.model';
import { TransactionService } from '../../../../components/core/services/transaction.service';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService } from '@client-monorepo/common/utilities';
import { TransactionListComponent } from '../../../../shared/components/transaction-list/transaction-list.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [LoadingTRXComponent, TransactionListComponent, SpinnerComponent, AppBarWrapperComponent],
})
export class TransactionsComponent extends BaseComponent implements OnInit {
  isLoading = signal<boolean>(true);
  isLoadingMore = signal<boolean>(false);
  transactions = signal<ITransaction_V2[] | undefined>(undefined);
  lastPage = signal<number | undefined>(undefined);
  offlinePage = signal<number>(1);
  onlinePage = signal<number>(1);
  transactionsHasError = signal<boolean | undefined>(undefined);
  qparams = signal<Params | undefined>(undefined);
  onlineTRXLoading = signal<boolean>(false);

  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private transactionService = inject(TransactionService);
  private navigationService = inject(WealthNavigationService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.qparams.set(this.activatedRoute.snapshot.queryParams);
    this.getTransactions();
  }

  private getTransactions() {
    this.transactionService.getTransactions(this.offlinePage(), this.qparams()).subscribe((res) => {
      if (res?.success) {
        this.transactions.set(this.updateArray(this.transactions(), res.result.details));
        this.transactionsHasError.set(res.success);
        this.lastPage.set(Math.ceil(res.result.total / 10));
      }
      this.isLoading.set(false);
    });
  }

  private updateArray(offTRX: ITransaction_V2[], onTRX: ITransaction_V2[]): ITransaction_V2[] {
    const map = new Map<number, ITransaction_V2>();

    offTRX?.forEach((item) => {
      map.set(item.uniqueId, item);
    });

    onTRX?.forEach((item) => {
      map.set(item.uniqueId, item);
    });

    return Array.from(map.values());
  }

  getNextPage(page: number) {
    this.isLoadingMore.set(true);
    if (page > this.lastPage()) {
      this.isLoadingMore.set(false);
      return;
    }
    this.transactionService
      .getTransactions(page, this.qparams())
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((respo: any) => {
        this.transactions.set(this.updateArray(this.transactions(), respo.result.details));
        this.isLoadingMore.set(false);
      });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
