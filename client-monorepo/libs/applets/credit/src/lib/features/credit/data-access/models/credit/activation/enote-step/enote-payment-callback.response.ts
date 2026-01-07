import { GenericApiResponse } from '../../../generic-api-response.model';

export interface EnotePaymentCallbackResponse extends GenericApiResponse {
  imageId: string;
  noteDescription: string;
  noteTitle: string;
  pageTitle: string;
}
