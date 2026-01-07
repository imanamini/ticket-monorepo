import { GenericApiResponse } from '../generic-api-response.model';

export interface CreditSmartScoringInitResponse extends GenericApiResponse {
  trackingCode: string;
  needOtp: boolean;
  otpLength: number;
  otpCountDown: number;
  resendAvailable: boolean;
}
