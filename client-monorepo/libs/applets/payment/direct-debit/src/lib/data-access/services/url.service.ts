import { Injectable } from '@angular/core';
import { ANDROID_PILLAR_CALLBACK_ORIGIN, IOS_PILLAR_CALLBACK_ORIGIN } from '@client-monorepo/pillar/digikala';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private redirectUrl = '/direct-debit/result';
  constructor(private hybridService: NgxHybridService) {}

  public setPaymentUrl(withOrigin?: boolean): string {
    if (this.hybridService.isHybrid()) {
      return this.hybridPaymentUrl();
    }
    return this.callbackUrl();
  }

  public callbackUrl(withOrigin = true) {
    const location = window.location.origin;
    return (withOrigin ? location : '') + this.redirectUrl;
  }

  public callbackUrlPillar(platform: string) {
    const paymentResultUrl = this.redirectUrl;
    switch (platform) {
      case 'android':
        return ANDROID_PILLAR_CALLBACK_ORIGIN + paymentResultUrl;
      case 'ios':
        return IOS_PILLAR_CALLBACK_ORIGIN + paymentResultUrl;
      default:
        return window.location.origin + paymentResultUrl;
    }
  }

  private hybridPaymentUrl() {
    const location = window.location.origin.replace(/(^\w+:|^)\/\//, '');
    return 'dgp://' + location + this.redirectUrl;
  }
}
