import { GenericApiResponse } from '../../../generic-api-response.model';
import { ACCOUNT_BLOCK_STATUS } from './account-block-step-status';

export interface AccountBlockStepStatusResponse extends GenericApiResponse {
  status: ACCOUNT_BLOCK_STATUS;
}
