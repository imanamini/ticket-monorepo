import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionCardComponent } from '../transaction-card/transaction-card.component';
import { TransactionCard } from '@client-monorepo/payment/transactions';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'payment-transactions-transaction-cards',
  standalone: true,
  imports: [CommonModule, TransactionCardComponent, NgxSkeletonLoadingComponent],
  templateUrl: './transaction-cards.component.html',
  styleUrl: './transaction-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionCardsComponent {
  transactionCards = input.required<TransactionCard[]>();
  mode = input.required<'upcoming' | 'history' | 'pending' | 'frequent'>();
  isLoading = input<boolean>(false);
  maxItems = input<number>(3);
  maxHeight = input<string>('235px');
  rangeCreator = rangeCreator;
  id = input.required<string>();
  transactionsStyle = computed(() => {
    return this.transactionCards().length > this.maxItems() ? { maxHeight: this.maxHeight() } : {};
  });
  itemClicked = output<TransactionCard>();

  itemClick(item: TransactionCard): void {
    this.itemClicked.emit(item);
  }
}
