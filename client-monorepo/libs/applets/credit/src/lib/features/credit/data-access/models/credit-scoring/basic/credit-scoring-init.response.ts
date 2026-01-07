import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringInitResponse extends GenericApiResponse {
  trackingCode: string;
  color: number;
  imageId: string;
  title: string;
  termsUrl: string;
}
