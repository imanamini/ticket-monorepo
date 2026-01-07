import { PagedPayloadInterface } from '@client-monorepo/common/network';
import { TransactionSearchPayloadOrderItemInterface } from './transaction-search-payload-order-item.interface';
import { TransactionSearchPayloadRestrictionItemInterface } from './transaction-search-payload-restriction-item.interface';

export interface TransactionSearchPayloadInterface extends PagedPayloadInterface {
  restrictions?: Array<TransactionSearchPayloadRestrictionItemInterface>;
  orders?: Array<TransactionSearchPayloadOrderItemInterface>;
}
