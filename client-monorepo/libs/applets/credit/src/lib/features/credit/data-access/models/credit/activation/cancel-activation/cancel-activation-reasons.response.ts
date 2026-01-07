import { GenericApiResponse } from '../../../generic-api-response.model';
import { ACTIVATION_CANCEL_RESPONSE_STATE } from './activation-cancel-response-state';

export interface CancelActivationReasonsResponse extends GenericApiResponse {
  cancelReasons: {
    cancelReasonType: string;
    message: string;
    inputEnabled?: boolean;
  }[];
}

export enum CancelReasonType {
  CHANGE_CREDIT = 1,
  CHANGE_INSTALLMENT_COUNT = 2,
  NO_NEED_CREDIT = 3,
  OTHER = 4,
}

export interface CancelActivationBottomSheetResult {
  done: boolean;
  activationCancelResponseState: ACTIVATION_CANCEL_RESPONSE_STATE;
}
