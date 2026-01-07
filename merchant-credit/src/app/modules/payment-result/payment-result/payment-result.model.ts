import { BaseApiResponse } from '../../../api/models/base-api.response';


export enum PaymentResult {
  SUCCESS,
  FAILURE
}
export interface PaymentResultModel extends BaseApiResponse {
  activityInfo: ActivityInfo[];
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  message: string;
  paymentResult: PaymentResult;
}

export interface ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}
