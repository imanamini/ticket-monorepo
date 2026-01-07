import { ApiResult } from './api-result.model';

export interface LoginResponse {
  result: ApiResult;
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
}
