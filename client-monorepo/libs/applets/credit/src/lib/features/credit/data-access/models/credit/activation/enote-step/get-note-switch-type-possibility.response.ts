import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetNoteSwitchTypePossibilityResponse extends GenericApiResponse {
  possible: boolean;
}
