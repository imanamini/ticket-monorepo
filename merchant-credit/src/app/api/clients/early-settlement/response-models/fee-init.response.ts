import { BaseApiResponse } from '../../../models/base-api.response';

export interface FeeInitResponse extends BaseApiResponse {
  ticket?: string;
  payable?: boolean;
  message?: message;
  trackingCode?: string;
}

export interface message {
  title: string;
  description: string;
}
