import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionCardComponent } from '../transaction-card/transaction-card.component';
import { TransactionCardService } from '../../data-access/services/transaction-card.service';
import { TransactionInterface } from '../../data-access/models/transaction.interface';
import { GroupedTransactionsInterface } from '../../data-access/models/grouped-transactions.interface';
import { InitialTransactionsGroups } from '../../data-access/constants/initial-transactions-groups.const';
import { TransactionCard } from '../../data-access/models/transaction-card';
import { ScrolledToEndDirective } from '@client-monorepo/common/utilities';

@Component({
  selector: 'payment-transactions-grouped-transactions',
  standalone: true,
  imports: [CommonModule, TransactionCardComponent, ScrolledToEndDirective],
  templateUrl: './grouped-transactions.component.html',
  styleUrl: './grouped-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupedTransactionsComponent {
  currentDate = new Date();
  groups = InitialTransactionsGroups;
  scrolledToEnd = output();
  pendingTransactions = input<TransactionCard[]>([]);
  transactions = input<TransactionInterface[] | TransactionCard[]>([]);
  isLoading = input<boolean>(true);
  transactionCardService = inject(TransactionCardService);
  mode = input<'history' | 'upcoming'>('history');
  transactionGroups = computed<Array<GroupedTransactionsInterface>>(() => {
    let groups = JSON.parse(JSON.stringify(this.groups));
    this.transactions().forEach((transaction) => {
      groups.forEach((group: GroupedTransactionsInterface) => {
        if (!group.tempItems) {
          group.tempItems = [];
        }
        if (transaction.exerciseDate && transaction.exerciseDate >= group.dateStart && transaction.exerciseDate <= group.dateEnd) {
          if (this.mode() === 'history') {
            group.tempItems.push(transaction as TransactionInterface);
            return;
          } else {
            group.items.push(transaction as TransactionCard);
          }
        }
      });
    });
    if (this.mode() === 'history') {
      groups = groups.map((group: GroupedTransactionsInterface) => {
        if (group.pendingTransaction) {
          group.items = this.pendingTransactions();
          return group;
        }
        group.items = this.transactionCardService.mapPastTransactionsToTransactionCards(group.tempItems ?? []);
        return group;
      });
    }
    return groups;
  });

  listEnded(): void {
    this.scrolledToEnd.emit();
  }
}
