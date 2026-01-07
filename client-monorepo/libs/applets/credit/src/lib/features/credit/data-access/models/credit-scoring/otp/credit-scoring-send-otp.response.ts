import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringSendOtpResponse extends GenericApiResponse {
  otpCountDown: number;
  resendAvailable: boolean;
}
