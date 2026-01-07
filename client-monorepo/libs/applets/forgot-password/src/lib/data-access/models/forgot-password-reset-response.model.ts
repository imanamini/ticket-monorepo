import { ApiResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

export interface ForgotPasswordResetResponseModel {
  accessToken: string;
  expireIn: number;
  refreshToken: string;
  result: ApiResult;
  tokenType: string;
  userId: string;
}
