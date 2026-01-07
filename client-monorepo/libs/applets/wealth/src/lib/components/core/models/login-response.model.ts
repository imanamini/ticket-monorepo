import { ApiResult } from '@digipay/ngx-payment-result';

export interface LoginResponse {
  result: ApiResult;
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
}
