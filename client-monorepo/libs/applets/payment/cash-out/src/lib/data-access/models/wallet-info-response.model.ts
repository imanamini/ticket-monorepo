import { ApiResultInterface } from '@client-monorepo/common/network';

export interface WalletInfoResponse {
  result: ApiResultInterface;
  walletBalance: number;
  remainingCap: number;
  maxAmount: number;
  minAmount: number;
  minEffectiveHours: number;
  tacUrl: string;
  certFile: string;
  feeCharge?: number;
  cashoutableBalance: number;
  dailyCapAmount: number;
  dailyTotalCashOutAmount: number;
}

export interface FeeChargeApiResponse {
  result: ApiResultInterface;
  feeCharge: number;
}
