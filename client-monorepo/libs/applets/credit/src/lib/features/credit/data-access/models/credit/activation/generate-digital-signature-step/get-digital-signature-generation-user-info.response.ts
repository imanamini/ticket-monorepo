import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetDigitalSignatureGenerationUserInfoResponse extends GenericApiResponse {
  name: string;
  surname: string;
  fullName: string;
  birthCertificate: string;
  postalCode: string;
  nationalCode: string;
  englishName: string;
  englishSurname: string;
  nationalCardSerial: string;
  digitalSignatureTac: boolean;
}
