import { ApiResultInterface } from '@client-monorepo/common/network';
import { OwnerSide } from './owner-side.enum';
import { TransactionType } from './transaction-type.enum';

export type PendingTransactionApiResponse = {
  result: ApiResultInterface;
  drafts: Array<PendingTransaction>;
};

export type PendingTransaction = {
  amount: number;
  name: string;
  imageId: string;
  trackingCode: string;
  detailURL: string;
  ownerSide: OwnerSide;
  feeCharge: number;
  description: string;
  type: TransactionType;
  expirationDate: number;
  creationDate: number;
};
