import { BaseApiResponse } from '../../../models/base-api.response';

export interface EsLoanIcsSendOtpResponseInterface extends BaseApiResponse {
  trackingCode: string;
  otpExpireDuration: number;
  status: number;
}
