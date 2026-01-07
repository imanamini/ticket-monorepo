import { GenericApiResponse } from '../../generic-api-response.model';
import { PlanGroup } from '../../credit/pre-registration/credit-plan-group';

export interface CreditScoringSuggestedPlansResponse extends GenericApiResponse {
  planGroupDetails: PlanGroup[];
}
