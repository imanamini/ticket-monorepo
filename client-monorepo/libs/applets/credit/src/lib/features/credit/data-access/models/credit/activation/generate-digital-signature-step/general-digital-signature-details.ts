import { GenericApiResponse } from '../../../generic-api-response.model';

export interface DigitalSignatureDetailsResponse extends GenericApiResponse {
  name: string;
  surname: string;
  nationalCode: string;
  birthCertificate: string;
  postalCode: string;
  signatureExpiryDays: number;
}
