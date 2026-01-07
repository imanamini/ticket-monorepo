import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditScoringInquiryResponse extends GenericApiResponse {
  score: string;
  isAcceptable: boolean;
}
