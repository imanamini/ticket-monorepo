import { GenericApiResponse } from '../../../generic-api-response.model';

export interface RegisterDigitalSignatureResponse extends GenericApiResponse {
  redirectUrl: string;
}
