import { TransactionCard, TransactionInterface } from '@client-monorepo/payment/transactions';

export interface GroupedTransactionsInterface {
  label: string;
  dateStart: number;
  dateEnd: number;
  items: Array<TransactionCard>;
  tempItems?: Array<TransactionInterface>;
  pendingTransaction?: boolean;
}
