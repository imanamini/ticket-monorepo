import { GenericApiResponse } from '../../../generic-api-response.model';

export interface PhysicalNoteDocument {
  description: string;
  docId: string;
  imageId: string;
  option: number;
  order: number;
  reasons: Array<{
    description: string;
    title: string;
    type: string;
  }>;
  status: string;
  tag: string;
  title: string;
}

export interface PhysicalNoteDetailResponse extends GenericApiResponse {
  document: PhysicalNoteDocument;
}
