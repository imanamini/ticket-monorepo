import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

export interface VoucherCodeFormResult {
  code?: string;
  confirmed: boolean;
  result?: PaymentResult;
}
