import { BaseApiResponse } from '../base-api.response';

export interface SignableDocumentsResponse extends BaseApiResponse {
  documents: SignableDocument[];
}

export interface SignableDocument {
  creditId: string;
  documentUrl: string;
  status: SignableDocumentStatus;
  trackingCode: string;
  title: string;
  creationDate: number;
}

export enum SignableDocumentStatus {

}
