import { ApiResponse } from '../api-response.model';

export interface LoginResponse extends ApiResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
}