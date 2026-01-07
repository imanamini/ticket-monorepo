import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringPayUrlResponse extends GenericApiResponse {
  ticket: string;
  payUrl: string;
  fallbackUrl: string;
}
