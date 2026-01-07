import { UploadedDocumentModel } from './uploaded-document.model';

export interface OrderDocuments {
  license: string;
  documents: UploadedDocumentModel[];
}
