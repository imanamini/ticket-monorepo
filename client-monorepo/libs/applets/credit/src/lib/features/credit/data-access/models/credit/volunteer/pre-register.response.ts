import { GenericApiResponse } from '../../generic-api-response.model';
import { VOLUNTEER_STATES } from './volunteer-state.enum';
import { VOLUNTEER_STATE_TYPE } from './volunteer-state-type.enum';

export interface PreRegisterErrorResponse extends GenericApiResponse {
  messages?: Array<{
    text: string;
    fieldName: string;
  }>;
}

export interface PreRegisterResponse extends GenericApiResponse {
  volunteerStateType: VOLUNTEER_STATE_TYPE;
  state: VOLUNTEER_STATES;
  fundProviderCode: number;
  creditId: string;
  cellNumber: string;
}
