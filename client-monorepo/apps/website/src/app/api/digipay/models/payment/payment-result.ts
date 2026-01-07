import { BaseApiResponse } from '../base-api.response';
import { ApiResult } from '../api-result.model';

export interface PaymentResult extends BaseApiResponse {
  result: ApiResult;
  activityInfo: ActivityInfo[];
  paymentResult: PaymentResultStatus;
  autoRedirect: boolean;
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  message: string;
  topDescription: TopDescription;
  redirectDetail?: {
    text: string;
    path: string;
    method: string;
    data: string;
  };
  type: number;
  trackingCode?: string;
}

export interface ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}

export enum PaymentResultStatus {
  SUCCESS,
  FAILED,
}

export class TopDescription {
  text: string;
  textColor: number;
  backgroundColor: number;
}
