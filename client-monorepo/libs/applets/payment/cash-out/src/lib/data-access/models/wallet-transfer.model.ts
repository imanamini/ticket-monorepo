import {ApiResultInterface} from '@client-monorepo/common/network';

export interface WalletTransferModel {
  result: ApiResultInterface,
  remainingCap: number;
  maxAmount: number;
  minAmount: number;
  walletBalance: number;
  description: string;
}
