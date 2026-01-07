import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetDigitalSignatureImageResponse extends GenericApiResponse {
  imageId: string;
}
