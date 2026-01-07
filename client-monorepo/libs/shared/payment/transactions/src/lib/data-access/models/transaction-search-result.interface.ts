import { PagedApiResultInterface } from '@client-monorepo/common/network';
import { TransactionInterface } from './transaction.interface';

export interface TransactionSearchResultInterface extends PagedApiResultInterface {
  activities: Array<TransactionInterface>;
}
