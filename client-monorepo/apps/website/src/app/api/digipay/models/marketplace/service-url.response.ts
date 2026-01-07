import { BaseApiResponse } from '../base-api.response';

export interface ServiceUrlResponse extends BaseApiResponse {
  redirectUrl: string;
}
