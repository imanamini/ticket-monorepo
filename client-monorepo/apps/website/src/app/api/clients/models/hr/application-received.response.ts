import { BaseResponse } from '../base.response';

export interface ApplicationReceivedResponse extends BaseResponse {
  message: string;
  description: string;
}
