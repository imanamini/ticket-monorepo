import { TransactionType } from './transaction-type.enum';

export interface TransactionTypeGroupInterface {
  name: string;
  types: Array<TransactionType>;
  type: 'income' | 'expense' | 'both';
}
