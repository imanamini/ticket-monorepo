import { GenericApiResponse } from '@client-monorepo/common/network';

export interface WalletBalanceResponse extends GenericApiResponse {
  amount: number;
}
