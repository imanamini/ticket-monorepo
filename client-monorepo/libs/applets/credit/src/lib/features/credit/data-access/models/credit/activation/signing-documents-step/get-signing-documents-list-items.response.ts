import { GenericApiResponse } from '../../../generic-api-response.model';
import { GetSigningDocumentsItem } from './get-signing-documents-item';

export interface GetSigningDocumentsListItemsResponse extends GenericApiResponse {
  description: string;
  fundProviderIcon: string;
  userFullName: string;
  documents: GetSigningDocumentsItem[];
}
