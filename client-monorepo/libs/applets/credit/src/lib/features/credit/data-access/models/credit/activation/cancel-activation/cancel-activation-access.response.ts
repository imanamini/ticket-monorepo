import { GenericApiResponse } from '../../../generic-api-response.model';
import { CANCEL_ACTIVATION_ACCESS_STATUS } from './cancel-activation-access-status';

export interface CancelActivationAccessResponse extends GenericApiResponse {
  activationArchiveAccess: CANCEL_ACTIVATION_ACCESS_STATUS;
}
