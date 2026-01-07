import { ApiResultInterface } from '@client-monorepo/common/network';

export interface RefundReasonResponse {
  description: string;
  code: number;
  result: ApiResultInterface;
}

export interface RefundRequest {
  code: number;
  trackingCode: string;
  customDescription: string;
}

export interface RefundResponse {
  description: string;
  code: number;
  result: ApiResultInterface;
}
