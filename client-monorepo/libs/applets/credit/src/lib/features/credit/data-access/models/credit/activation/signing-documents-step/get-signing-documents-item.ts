import { SigningDocumentItemStatus } from './signing-document-item-status';

export interface GetSigningDocumentsItem {
  docId: string;
  generationTime: number;
  order: number;
  signTime: number;
  status: SigningDocumentItemStatus;
  title: string;
  trackingCode: string;
}
