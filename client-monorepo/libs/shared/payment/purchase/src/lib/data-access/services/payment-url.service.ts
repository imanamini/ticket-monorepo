import { Injectable } from '@angular/core';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentUrlService {
  constructor(private hybridService: NgxHybridService) {}

  public setPaymentUrl(paymentType: string, withOrigin?: boolean): string {
    if (this.hybridService.isHybrid()) {
      return this.hybridPaymentUrl(paymentType);
    }
    return this.paymentCallbackUrl(paymentType, withOrigin);
  }

  public setCashInCallBackUrl(url: string) {
    const baseUrl = window.location.origin || window.location.protocol + '//' + window.location.host;
    return baseUrl + '/' + url + '/confirm?ticket=%s&page=CASH_IN_REDIRECT';
  }

  public paymentCallbackUrl(paymentType: string, withOrigin = true) {
    const location = window.location.origin || window.location.protocol + '//' + window.location.host;
    return (withOrigin ? location : '') + '/payment/result/' + paymentType;
  }

  private hybridPaymentUrl(paymentType: string) {
    const origin = window.location.origin || window.location.protocol + '//' + window.location.host;
    const location = origin.replace(/(^\w+:|^)\/\//, '');
    return 'dgp://' + location + '/payment/result/' + paymentType;
  }

  public appCallbackUrl(relativePath: string, hasHybridMode = false) {
    if (relativePath[0] !== '/') {
      relativePath = '/' + relativePath;
    }
    if (hasHybridMode && this.hybridService.isHybrid()) {
      const origin = window.location.origin || window.location.protocol + '//' + window.location.host;
      const location = origin.replace(/(^\w+:|^)\/\//, '');
      return 'dgp://' + location + relativePath;
    }
    const origin = window.location.origin || window.location.protocol + '//' + window.location.host;
    return origin + relativePath;
  }
}
