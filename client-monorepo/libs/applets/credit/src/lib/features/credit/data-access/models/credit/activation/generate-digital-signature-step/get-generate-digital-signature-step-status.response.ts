import { GenericApiResponse } from '../../../generic-api-response.model';
import { GenerateDigitalSignatureStepStatus } from './generate-digital-signature-step-status';

export interface GetGenerateDigitalSignatureStepStatusResponse extends GenericApiResponse {
  status: GenerateDigitalSignatureStepStatus;
}
