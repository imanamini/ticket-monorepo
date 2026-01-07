import { PaymentResult } from '@digipay/ngx-payment-result';
import { statusPaymentResultType } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

export enum PaymentResultStatus {
  SUCCESS,
  FAILED,
}

export const PaymentResultStatusMapper: Record<PaymentResultStatus, statusPaymentResultType> = {
  [PaymentResultStatus.SUCCESS]: 'success',
  [PaymentResultStatus.FAILED]: 'error',
};

export interface PaymentResultInterface extends Omit<PaymentResult, 'paymentResult'> {
  trackingCode: string;
  paymentResult: PaymentResultStatus;
  activityInfo: ActivityInfo[];
  detailInfo: {
    [key: string]: {
      value: string;
      copyable: boolean;
    };
  }[];
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
