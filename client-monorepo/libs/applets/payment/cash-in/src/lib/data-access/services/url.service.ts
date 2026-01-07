import { Injectable } from '@angular/core';
import { ANDROID_PILLAR_CALLBACK_ORIGIN, IOS_PILLAR_CALLBACK_ORIGIN } from '@client-monorepo/pillar/digikala';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(private hybridService: NgxHybridService) {}

  public setPaymentUrl(paymentType: string, withOrigin?: boolean, preferredUrl?: string): string {
    if (this.hybridService.isHybrid()) {
      return this.hybridPaymentUrl(paymentType);
    }
    return this.paymentCallbackUrl(paymentType, withOrigin, preferredUrl);
  }

  public paymentCallbackUrl(paymentType: string, withOrigin = true, preferredUrl?: string) {
    const location = window.location.origin;
    return (withOrigin ? location : '') + (preferredUrl == null ? '/payment/result/' + paymentType : preferredUrl);
  }

  public paymentCallbackUrlPillar(platform: string, paymentType: string) {
    const paymentResultUrl = '/payment/result/' + paymentType;
    switch (platform) {
      case 'android':
        return ANDROID_PILLAR_CALLBACK_ORIGIN + paymentResultUrl;
      case 'ios':
        return IOS_PILLAR_CALLBACK_ORIGIN + paymentResultUrl;
      default:
        return window.location.origin + paymentResultUrl;
    }
  }

  private hybridPaymentUrl(paymentType: string) {
    const location = window.location.origin.replace(/(^\w+:|^)\/\//, '');
    return 'dgp://' + location + '/payment/result/' + paymentType;
  }

  public appCallbackUrl(relativePath: string, hasHybridMode = false) {
    if (relativePath[0] !== '/') {
      relativePath = '/' + relativePath;
    }
    if (hasHybridMode && this.hybridService.isHybrid()) {
      const location = window.location.origin.replace(/(^\w+:|^)\/\//, '');
      return 'dgp://' + location + relativePath;
    }
    return window.location.origin + relativePath;
  }
}
