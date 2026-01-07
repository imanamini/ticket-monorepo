import { Injectable, NgZone } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { PayMethodPickerService } from '@client-monorepo/payment/purchase';
import { CreditPayResult } from '../../features/credit/data-access/services/credit-pay-result';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class CreditWindowPaymentService {
  constructor(
    private zone: NgZone,
    private payMethod: PayMethodPickerService,
    private hybridService: NgxHybridServiceService,
  ) {}

  attachCreditPayment() {
    window.creditPayment = {};
    window.creditPayment.pay = (request: CreditPayResult) => {
      this.zone.run(() => {
        if (request.preferredMethod) {
          switch (request.preferredMethod) {
            case 'WALLET':
              this.payMethod.payTicketByWallet(request.ticket, window.location.pathname, request.relativeCallbackUrl);
              break;
            case 'IPG':
              this.payMethod.openIpg(request.payUrl, request.ticket);
              break;
            case 'DPG':
              this.payMethod.payByDpg(request.ticket, window.location.pathname, request.relativeCallbackUrl, request.amount);
          }
        } else {
          this.askPayMethod(request);
        }
      });
    };

    window.creditPayment.newPay = (request: CreditPayResult) => {
      this.zone.run(() => {
        const hybridState = this.hybridService.isHybrid() ? 'isHybrid=true' : 'isHybrid=false';
        const hasQueryParam = request.payUrl.includes('?');
        let url = request.payUrl;
        url += hasQueryParam ? '&' : '?';
        url += hybridState;
        if (this.hybridService.isHybrid()) {
          this.hybridService.openUrlInHybrid(url, false);
        } else {
          window.open(url, '_self');
        }
      });
    };
  }

  askPayMethod(request: CreditPayResult): void {
    this.payMethod.ask(request.amount, request.ticket).then((result) => {
      if (!result) {
        return;
      }
      if (result.method === 'WALLET') {
        this.payMethod.payTicketByWallet(request.ticket, window.location.pathname, request.relativeCallbackUrl);
      }
      if (result.method === 'IPG') {
        this.payMethod.goToIpg(result, request.ticket);
      }
      if (result.method === 'DPG') {
        this.payMethod.payByDpg(request.ticket, window.location.pathname, request.relativeCallbackUrl, request.amount);
      }
    });
  }
}
