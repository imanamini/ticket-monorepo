import { ApiResponse } from '../../../../../api/api-response.model';

export interface PaymentInfoResponse extends ApiResponse {
  amount: number;
  certFile: string;
  pspCode: string;
  walletBalance: number;
  images: string[];
  ipgImages: string[];
}
