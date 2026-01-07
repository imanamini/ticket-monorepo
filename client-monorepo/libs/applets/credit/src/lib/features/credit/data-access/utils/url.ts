import { Inject, Injectable } from '@angular/core';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from '../../credit-environment.interface';
import { CreditExternalService } from '../services/credit-external.service';
import { CreditServiceTypeService } from '../services/credit-service-type.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { CreditDigikalaService } from '../services/pillar/credit-digikala.service';
import { ANDROID_PILLAR_CALLBACK_ORIGIN, IOS_PILLAR_CALLBACK_ORIGIN } from '../models/pillar/pillar-credit-callback-url.const';

@Injectable({
  providedIn: 'root',
})
export class CreditUrlService {
  constructor(
    private creditExternalService: CreditExternalService,
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
    private creditServiceTypeService: CreditServiceTypeService,
    private hybridService: NgxHybridServiceService,
    private creditDigikalaService: CreditDigikalaService,
  ) {}

  /**
   * Used for generating callback URLS
   * for different services.
   *
   * User will be redirected to this URLs after
   * visiting the payment gateway
   *
   */
  paymentCallbackUrl(paymentType: string, withOrigin = true, postfixUrl = ''): string {
    const inApp = this.creditExternalService.inApp.getValue();
    const creditEnv = this.creditEnvironment.creditEnv;
    let relativeUrl = this.getInnerServicePath('/payment-result/' + paymentType);
    if (paymentType === 'credit-scoring') {
      relativeUrl = this.getInnerServicePath('/score/payment-result');
    }
    if (paymentType === 'payment-step') {
      relativeUrl = this.getInnerServicePath('/wallet/activation/payment/result');
    }
    if (paymentType === 'pre-payment-step') {
      relativeUrl = this.getInnerServicePath('/wallet/activation/pre-payment/result');
    }
    if (paymentType === 'early-settlement') {
      relativeUrl = this.getInnerServicePath('/early-settlement/pay-result');
    }
    if (paymentType === 'enote') {
      relativeUrl = this.getInnerServicePath('/wallet/activation/enote/pay-result');
    }

    relativeUrl += postfixUrl || '';
    if (withOrigin && creditEnv === 'express' && inApp) {
      relativeUrl = '?inapp=1&openApp=1&callbackUrl=' + relativeUrl;
    }

    const isPillar = creditEnv === 'pillar';
    if (isPillar) {
      const platform = this.creditDigikalaService.getPlatform();
      switch (platform) {
        case 'android':
          return ANDROID_PILLAR_CALLBACK_ORIGIN + relativeUrl;
        case 'ios':
          return IOS_PILLAR_CALLBACK_ORIGIN + relativeUrl;
        default:
          return window.location.origin + relativeUrl;
      }
    } else {
      return this.hybridService.setPaymentUrl('', relativeUrl, withOrigin);
    }
  }

  getPaymentTicketCallbackUrl(paymentType: string, postfixUrl = ''): string {
    return this.paymentCallbackUrl(paymentType, true, postfixUrl);
  }

  getUrlAfterResult(relativePath = ''): string {
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      const mainPath = this.creditServiceTypeService.giveResultByType<string>('/mini-app/credit', '/mini-app/bnpl');
      return window.location.origin + mainPath + relativePath;
    }
    return relativePath;
  }

  getInnerServiceAbsoluteUrl(relativePath = ''): string {
    const innerServicePath = this.getInnerServicePath(relativePath);
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      return window.location.origin + '/mini-app/credit' + innerServicePath;
    }
    return window.location.origin + innerServicePath;
  }

  getInnerServicePath(relativePath = ''): string {
    const mainPath = this.creditServiceTypeService.giveResultByType<string>('/service/credit', '/service/bnpl');
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      return '' + relativePath;
    }

    return mainPath + relativePath;
  }

  getOuterServicePath(serviceName: string, prefix = '/', relativePath = ''): string {
    return prefix + 'service/' + serviceName + relativePath;
  }

  getHomeAppPath(): string {
    if (this.creditEnvironment.creditEnv === 'express' || this.creditEnvironment.creditEnv === 'dpx') {
      return '/';
    }
    return '/home';
  }

  getApiUrl(): string {
    if (window?.origin?.startsWith('https://drapp.mydigipay')) {
      return 'https://drapi.mydigipay.com/digipay/api/';
    } else if (this.creditEnvironment.name === 'production') {
      return 'https://api.mydigipay.com/digipay/api/';
    } else {
      return 'https://uat.mydigipay.info/digipay/api/';
    }
  }
}
