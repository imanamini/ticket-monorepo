import { ApiResponse } from '../../../../../api/api-response.model';

export interface DynamicPasswordResponse extends ApiResponse {
  validityDuration: number;
}
