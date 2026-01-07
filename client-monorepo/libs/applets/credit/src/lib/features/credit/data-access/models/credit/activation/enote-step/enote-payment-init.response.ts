import { GenericApiResponse } from '../../../generic-api-response.model';

export interface EnotePaymentInitResponse extends GenericApiResponse {
  fallbackUrl: string;
  payUrl: string;
  ticket: string;
}
