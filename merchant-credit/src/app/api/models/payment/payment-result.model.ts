import { BaseApiResponse } from '../base-api.response';

export enum PaymentResultStatus {
  SUCCESS,
  FAILED
}

export interface PaymentResult extends BaseApiResponse {
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
}

export interface ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}

export interface TopDescription {
  text: string;
  textColor: number;
  backgroundColor: number;
}
