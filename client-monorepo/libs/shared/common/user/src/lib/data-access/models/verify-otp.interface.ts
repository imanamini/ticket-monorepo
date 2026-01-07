import { ApiResultInterface } from '@client-monorepo/common/network';

export interface VerifyOtpRequest {
  smsToken: string;
  userId: string;
}

export interface VerifyOtpResponse {
  result: ApiResultInterface;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expireIn: number;
  userId: string;
  hasPassword?: boolean;
}
