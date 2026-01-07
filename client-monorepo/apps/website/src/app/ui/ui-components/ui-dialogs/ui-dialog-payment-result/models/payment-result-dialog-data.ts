import { PaymentResult } from '../../../../../api/digipay/models/payment/payment-result';

export interface PaymentResultDialogData {
  paymentResult: PaymentResult;
  backButtonText?: string;
  inApp?: boolean;
  statusKey: string;
}
