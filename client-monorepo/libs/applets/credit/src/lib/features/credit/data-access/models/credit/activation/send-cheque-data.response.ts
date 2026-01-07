import { GenericApiResponse } from '../../generic-api-response.model';

export interface SendChequeDataResponse extends GenericApiResponse {
  ownerName: string;
  ownerBirthCertificate: string;
}
