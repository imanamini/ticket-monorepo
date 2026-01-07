import { BaseApiResponse } from '../base-api.response';

export interface SignableDocumentConfigResponse extends BaseApiResponse {
  buttonLabel: string;
  description: string;
  imageId: string;
  title: string;
}
