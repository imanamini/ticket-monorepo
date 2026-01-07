import { BaseApiResponse } from '../base-api.response';

export interface DynamicPasswordResponse extends BaseApiResponse {
  validityDuration: number;
}
