import { BaseApiResponse } from '../base-api.response';

export interface LoginResponse extends BaseApiResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
  hasPassword: boolean;
}
