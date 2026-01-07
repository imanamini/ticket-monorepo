import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditPaymentStepInitResponse extends GenericApiResponse {
  ticket: string;
  payUrl: string;
  fallbackUrl: string;
  result: any;
}
