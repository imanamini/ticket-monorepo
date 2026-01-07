import { GenericApiResponse } from '../generic-api-response.model';

export interface CreditSmartScoringMaxBalanceResponse extends GenericApiResponse {
  balance: number;
  installmentCount: number;
}
