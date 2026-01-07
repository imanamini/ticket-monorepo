import { GenericResponse } from './generic.response';
import { PaymentResultEnum } from '../emuns/payment-result.enum';
import { PayWalletTypeEnum } from '../emuns/pay-wallet-type.enum';
import { RedirectDetailMethodEnum } from '../../wallet/payment-result/models/redirect-detail-method.enum';

export interface PaymentResult extends GenericResponse {
  paymentResult: PaymentResultEnum;
  type?: PayWalletTypeEnum;
  payInfo: PayInfo;
  status: string;
  color: number;
  imageId: string;
  title: string;
  amount: number;
  messageImageId: string;
  activityInfo: Array<{
    key: string;
    value: string;
    copyable?: boolean;
  }>;
  autoRedirect:boolean;
  redirectDetail?: {
    data: PayInfo,
    method: RedirectDetailMethodEnum,
    path: string,
    text: string
  };

// I'm not sure...
  message?: string;
}

export interface PayInfo {
  trackingCode: string;
  rrn?: string;
  psp?: string;
  providerId: string;
  amount: string;
}
