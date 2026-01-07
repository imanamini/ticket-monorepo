import { ApiResult } from '../api-result.model';

export interface PaymentSelectFeatureResponse {
  amount: number;
  cashInDefaultValue: number;
  cashInDefaults: number[];
  cashInXferMax: number;
  cashInXferMin: number;
  certFile: string;
  images: string[];
  needsKyc: boolean;
  payUrl: string;
  pspCode: string;
  rawAmount: number;
  redirectUrl: string;
  result: ApiResult;
  walletBalance: number;
}
