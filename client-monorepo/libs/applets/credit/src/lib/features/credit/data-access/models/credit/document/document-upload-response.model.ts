import { GenericApiResponse } from '../../generic-api-response.model';

export interface DocumentUploadResponse extends GenericApiResponse {
  imageId: string;
}
