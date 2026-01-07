import { ApiResultInterface } from '@client-monorepo/common/network';

export interface PaymentInfoResponse {
  result: ApiResultInterface;
  amount: number;
  certFile: string;
  pspCode: string;
  walletBalance: number;
  images: string[];
  ipgImages: string[];
}
