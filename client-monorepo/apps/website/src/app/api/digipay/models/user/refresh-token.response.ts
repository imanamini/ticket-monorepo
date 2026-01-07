import { BaseApiResponse } from '../base-api.response';

export interface RefreshTokenResponse extends BaseApiResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
}
