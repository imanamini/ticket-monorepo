import { BaseApiResponse } from '../base-api.response';

export interface SendOtpResponse extends BaseApiResponse {
  userId: string;
}
