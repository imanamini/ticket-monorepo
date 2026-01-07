import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  TransactionApiResponse,
  TransactionCard,
  TransactionCardsComponent,
  TransactionCardService,
  TransactionsApiService,
} from '@client-monorepo/payment/transactions';
import { finalize, Observable, Subscription, zip } from 'rxjs';
import { RefreshNotifierService } from '@client-monorepo/common/network';

@Component({
  selector: 'transactions-applet-frequent-transactions-summary',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, TransactionCardsComponent],
  templateUrl: './frequent-transactions-summary.component.html',
  styleUrl: './frequent-transactions-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrequentTransactionsSummaryComponent implements OnInit, OnDestroy {
  transactionCards = signal<TransactionCard[]>([]);
  isLoading = signal<boolean>(true);

  transactionCardService = inject(TransactionCardService);
  transactionApi = inject(TransactionsApiService);

  requestsSubscription!: Subscription;
  refreshNotifierService = inject(RefreshNotifierService);
  refreshNotifierSubscription!: Subscription;

  location = input<'transactions' | 'home'>('transactions');

  ngOnInit(): void {
    this.getFrequentTransactions();
    this.subscribeOnRefresh();
  }

  getFrequentTransactions(): void {
    this.isLoading.set(true);
    this.requestsSubscription = zip([this.getBundleFrequentTransactions(), this.getC2CFrequentTransactions()])
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ([bundleRes, c2cRes]) => {
          this.transactionCards.set(
            this.transactionCardService
              .mapC2CFrequentTransactionsToTransactionCards(c2cRes.paymentList)
              .concat(this.transactionCardService.mapBundleFrequentTransactionsToTransactionCards(bundleRes.paymentList))
              .slice(0, 3),
          );
        },
        error: () => {
          this.transactionCards.set([]);
        },
      });
  }

  getBundleFrequentTransactions(): Observable<TransactionApiResponse> {
    return this.transactionApi.getBundleFrequentTransactions();
  }

  getC2CFrequentTransactions(): Observable<TransactionApiResponse> {
    return this.transactionApi.getC2CFrequentTransactions();
  }

  subscribeOnRefresh(): void {
    this.refreshNotifierSubscription = this.refreshNotifierService.refreshNotifier
      .pipe((tf) => tf)
      .subscribe({
        next: () => {
          this.getFrequentTransactions();
        },
      });
  }

  ngOnDestroy(): void {
    this.requestsSubscription.unsubscribe();
  }
}
