import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

@Injectable({
  providedIn: 'root',
})
export class WalletPayService {
  payResponse: Subject<PaymentResult> = new Subject();

  constructor(private router: Router) {}

  ticket = '';

  homeUrl = '/home';

  startPayFlow(ticket: string, homeUrl: string) {
    this.ticket = ticket;
    this.homeUrl = homeUrl;
    this.router.navigateByUrl('/cash-out/wallet/pay');
  }

  afterPay() {
    return this.payResponse.asObservable();
  }

  clear() {
    this.ticket = '';
  }

  goToPaymentResultPage(paymentResult: PaymentResult, destinationUrl: string | null = null) {
    const dest = destinationUrl || '/payment/result/wallet';
    this.router.navigateByUrl(dest, {
      state: {
        paymentResult,
      },
    });
  }
}
