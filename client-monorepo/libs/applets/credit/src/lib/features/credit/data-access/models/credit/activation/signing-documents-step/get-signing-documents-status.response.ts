import { GenericApiResponse } from '../../../generic-api-response.model';
import { SigningDocumentsStepStatus } from './signing-documents-step-status';

export interface GetSigningDocumentsStatusResponse extends GenericApiResponse {
  status: SigningDocumentsStepStatus;
  isNeedPassword: boolean;
}
