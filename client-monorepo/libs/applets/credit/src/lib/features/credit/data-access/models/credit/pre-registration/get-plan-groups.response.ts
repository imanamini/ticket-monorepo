import { GenericApiResponse } from '../../generic-api-response.model';
import { PlanGroup } from './credit-plan-group';

export interface GetPlanGroupsResponse extends GenericApiResponse {
  planGroupDetails: PlanGroup[];
  hasCreditCapacity: boolean;
  hasBNPLCapacity: boolean;
}
