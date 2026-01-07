import { GenericApiResponse } from '../../../generic-api-response.model';
import { ACTIVATION_CANCEL_RESPONSE_STATE } from './activation-cancel-response-state';

export interface CancelActivationResponse extends GenericApiResponse {
  activationArchiveResponseState: ACTIVATION_CANCEL_RESPONSE_STATE;
}
