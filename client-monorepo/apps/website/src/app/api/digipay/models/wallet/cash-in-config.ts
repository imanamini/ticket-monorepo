import { BaseApiResponse } from '../base-api.response';

export interface CashInConfig extends BaseApiResponse {
  minAmount: number;
  maxAmount: number;
  defaultAmounts: number[];
  defaultAmountValue: number;
  directDebitEntrypoint: {
    url: string;
    title: string;
    featureName: string;
  };
}
