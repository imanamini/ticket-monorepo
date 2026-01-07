import { ApiResult } from '../../../../../shared/models/api-result.model';

export enum PaymentResultStatus {
  SUCCESS,
  FAILED
}

export class PaymentResult {
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
}

export class ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}

export class TopDescription {
  text: string;
  textColor: number;
  backgroundColor: number;
}
