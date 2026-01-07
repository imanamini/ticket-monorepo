import { ApiResultInterface } from '@client-monorepo/common/network';

export interface OtpVerifyResponseInterface {
  accessToken: string;
  expireIn: number;
  refreshToken: string;
  result: ApiResultInterface;
  tokenType: string;
  userId: string;
}
