import { ApiResponse } from '../../api/api-response.model';
import { PaymentResult, statusPaymentResultType } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

export interface PaymentResultDataModel extends ApiResponse {
  activityInfo: Record<string, any>;
  paymentResult: PaymentResultEnum;
  trackingCode: string;
  payInfo?: string;
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  message: string;
  redirectUrl?: string;
  messageImageId?: string;
  type?: number;
}

export interface PaymentResultServiceResponse {
  paymentResult: PaymentResult;
  trackingCode: string;
}

export interface ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}

export enum PaymentResultEnum {
  SUCCESS,
  FAILURE
}

export const PaymentResultEnumMapper: Record<PaymentResultEnum, statusPaymentResultType> = {
  [PaymentResultEnum.SUCCESS]: 'success',
  [PaymentResultEnum.FAILURE]: 'error'
};
