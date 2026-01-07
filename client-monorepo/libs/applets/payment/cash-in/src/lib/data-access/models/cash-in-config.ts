import { ApiResultInterface } from '@client-monorepo/common/network';

export interface CashInConfig {
  result: ApiResultInterface;
  minAmount: number;
  maxAmount: number;
  defaultAmounts: number[];
  defaultAmountValue: number;
  directDebitEntrypoint: {
    url: string;
    title: string;
    featureName: string;
  };
  walletBalance: number;
}
