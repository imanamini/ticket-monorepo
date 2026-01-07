import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Base64 } from 'js-base64';
import { PaymentResultInterface } from '@client-monorepo/payment/purchase';
@Injectable({
  providedIn: 'root',
})
export class WalletPayService {
  payResponse: Subject<PaymentResultInterface> = new Subject();

  constructor(private router: Router) {}

  ticket: string | null = null;

  homeUrl = '/hub';

  startPayFlow(ticket: string, homeUrl: string) {
    this.ticket = ticket;
    this.homeUrl = homeUrl;
    this.router.navigateByUrl('payment/wallet/pay');
  }

  afterPay() {
    return this.payResponse.asObservable();
  }

  clear() {
    this.ticket = null;
  }

  goToPaymentResultPage(paymentResult: PaymentResultInterface, destinationUrl: string | null = null) {
    const dest = destinationUrl || '/payment/result/wallet';

    if (dest.includes('dgp://', 0) || dest.includes('https://', 0)) {
      return this.handleWithOriginDestination(dest, paymentResult);
    }

    this.router.navigateByUrl(dest, {
      state: {
        paymentResult,
      }
    }).then();
  }

  handleWithOriginDestination(destination: string, paymentResult: PaymentResultInterface) {
    const data = destination.includes('?') ? '&data=' : '?data=';
    const finalDestination = destination + `${data}${this.encodeData(paymentResult)}`;
    window.open(finalDestination, 'self');
  }

  private encodeData(data: any) {
    return encodeURIComponent(Base64.encode(JSON.stringify(data)));
  }
}
