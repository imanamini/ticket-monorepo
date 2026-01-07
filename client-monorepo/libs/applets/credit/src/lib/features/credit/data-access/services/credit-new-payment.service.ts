import { Injectable } from '@angular/core';
import { CreditWindow } from './credit-window';
import { CreditUrlService } from '../utils/url';

declare const window: CreditWindow;

/*
This new service uses ticket version 2
*/
@Injectable({
  providedIn: 'root',
})
export class CreditNewPaymentService {
  constructor(private creditUrlService: CreditUrlService) {}

  pay(ticket: string, redirectUrl: string, amount: number) {
    if (window.creditPayment && typeof window.creditPayment.pay === 'function') {
      window.creditPayment.newPay({
        ticket,
        amount,
        fallbackUrl: this.creditUrlService.paymentCallbackUrl('credit', true, ''),
        payUrl: redirectUrl,
        callbackUrl: this.creditUrlService.paymentCallbackUrl('credit', true, ''),
        relativeCallbackUrl: this.creditUrlService.paymentCallbackUrl('credit', false, ''),
        relativeAfterResultUrl: '',
      });
    }
  }
}
