import { CreditPayResult } from './credit-pay-result';

export interface CreditWindow extends Window {
  creditPayment: {
    pay: (paymentRequest: CreditPayResult) => void;
    newPay: (paymentRequest: CreditPayResult) => void;
  };
  generateSign?: () => void;
}
