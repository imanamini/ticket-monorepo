import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringWithoutPayInitResponse extends GenericApiResponse {
  trackingCode: string;
  needOtp: boolean;
  otpLength: number;
  acceptable: boolean | null;
}
