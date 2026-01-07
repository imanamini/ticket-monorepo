import { GenericApiResponse } from '../../../api/digipay/models/generic-api-response.model';
import { PlanGroup } from './credit-plan-group';

export interface GetPlanGroupsResponse extends GenericApiResponse {
  planGroupDetails: PlanGroup[];
}
