import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  TransactionCard,
  TransactionCardsComponent,
  TransactionCardService,
  TransactionsApiService,
} from '@client-monorepo/payment/transactions';

@Component({
  selector: 'transactions-applet-pending-transactions-summary',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, TransactionCardsComponent],
  templateUrl: './pending-transactions-summary.component.html',
  styleUrl: './pending-transactions-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingTransactionsSummaryComponent implements OnInit {
  transactionCards = signal<TransactionCard[]>([]);

  transactionCardService = inject(TransactionCardService);
  transactionApi = inject(TransactionsApiService);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getPendingTransactions();
  }

  getPendingTransactions(): void {
    this.isLoading.set(true);
    this.transactionApi.getPendingTransactions().subscribe({
      next: (res) => {
        this.transactionCards.set(this.transactionCardService.mapPendingTransactionsToTransactionCards(res.drafts));
        this.isLoading.set(false);
      },
    });
  }
}
