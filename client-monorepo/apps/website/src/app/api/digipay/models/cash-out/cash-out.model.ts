import { ApiResult } from '../api-result.model';

export interface CashOutConfigModel {
  result: ApiResult;
  certFile: string;
  maxAmount: number;
  minAmount: number;
  minEffectiveHours: number;
  remainingCap: number;
  tacUrl: string;
  walletBalance: number;
}
