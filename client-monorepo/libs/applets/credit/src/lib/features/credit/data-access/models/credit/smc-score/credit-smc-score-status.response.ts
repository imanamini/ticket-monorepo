import { GenericApiResponse } from '../../generic-api-response.model';
import { CREDIT_SCORING_SMC_STATUS } from './credit-scoring-smc-status';

export interface CreditSmcScoreStatusResponse extends GenericApiResponse {
  status: CREDIT_SCORING_SMC_STATUS;
}
