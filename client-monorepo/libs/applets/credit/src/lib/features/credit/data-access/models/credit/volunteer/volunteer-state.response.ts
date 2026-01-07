import { GenericApiResponse } from '../../generic-api-response.model';
import { VOLUNTEER_STATES } from './volunteer-state.enum';

export interface VolunteerStateResponse extends GenericApiResponse {
  state: VOLUNTEER_STATES;
  resultUrl: string;
  chequeGuideUrl: string;
  cellOwnershipGuideUrl: string;
}
