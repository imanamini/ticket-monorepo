import { GenericApiResponse } from '../../../generic-api-response.model';
import { ENOTE_STEP_STATUS } from './enote-step-status';
import { EnoteFailureResultInterface } from './enote-failure-result.interface';

export interface GetEnoteStepStatusResponse extends GenericApiResponse {
  status: ENOTE_STEP_STATUS;
  failureResults: Array<EnoteFailureResultInterface>;
  fieldErrors: {
    fieldName: string;
    text: string;
  }[];
}
