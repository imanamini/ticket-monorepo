import { ApiResultInterface } from '@client-monorepo/common/network';

export interface ConflictResponse {
  result: ApiResultInterface;
  conflictReasons: ConflictReasonResponse[];
  supportPhoneNumber: string;
}

export interface ConflictReasonResponse {
  description: string;
  code: number;
}

export interface ConflictOrderRequest {
  code: number,
  customDescription: string,
  trackingCode: string
}