import { ApiResultInterface } from '@client-monorepo/common/network';

export type CoinBalanceResponse = {
  result: ApiResultInterface;
  balance: number;
  generalBalance: number;
  balanceDescription: string;
  generalDescription: string;
};
