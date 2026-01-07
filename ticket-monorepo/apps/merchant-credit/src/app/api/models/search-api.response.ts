import { ApiResult } from './api-result.model';

export interface SearchApiResponse {
  result: ApiResult;
  totalElements: number;
  totalPages: number;
}
