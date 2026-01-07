import { BaseApiResponse } from '../base-api.response';

export interface PaymentInitResponse extends BaseApiResponse {
  fallbackUrl: string;
  ticket: string;
  payUrl: string;
}
