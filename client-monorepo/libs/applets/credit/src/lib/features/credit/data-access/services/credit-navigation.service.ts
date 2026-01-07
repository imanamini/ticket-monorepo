import { Inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditUrlService } from '../utils/url';
import { CREDIT_ENVIRONMENT, CreditEnvironmentApiUrlInterface, CreditEnvironmentInterface } from '../../credit-environment.interface';

enum serviceType {
  CREDIT = 1,
  BNPL = 2,
}

export const CloseServiceUrlStateKey = 'closeServiceUrl';

@Injectable({
  providedIn: 'root',
})
export class CreditNavigationService {
  #closeServiceRedirectUrl = signal<string>('/');

  constructor(
    private router: Router,
    private creditUrlService: CreditUrlService,
    @Inject(CREDIT_ENVIRONMENT)
    private creditEnvironment: CreditEnvironmentInterface,
  ) {}

  setCloseServiceRedirectUrl(url?: string) {
    this.#closeServiceRedirectUrl.set(url ?? '/');
  }

  closeService(): void {
    let redirectUrl: string;
    if (this.creditEnvironment.creditEnv === 'dpx') {
      redirectUrl = this.#closeServiceRedirectUrl();
    } else {
      redirectUrl = '/';
    }

    this.router.navigateByUrl(redirectUrl);
  }

  getExpressToken(): string {
    const json = localStorage.getItem('__storage_1');
    if (json) {
      const obj = JSON.parse(json);
      if (obj.hasOwnProperty('accessToken')) {
        return obj.accessToken;
      }
    }
    return '';
  }

  getMiniAppToken(): string {
    const json = localStorage.getItem('__storage_mini_app_credit__');
    if (json) {
      const obj = JSON.parse(json);
      if (obj.hasOwnProperty('accessToken')) {
        return obj.accessToken;
      }
    }
    return '';
  }

  convertToAbsoluteUrl(relativeUrl: string): string {
    return window.location.origin + relativeUrl;
  }

  navigateToCreditScoringService(callback: string, nationalCode: string): void {
    if (this.creditEnvironment.creditEnv === 'express') {
      return this.navigateToCreditScoringServiceExpress(callback, nationalCode);
    }
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      return this.navigateToCreditScoringServiceMiniApp(callback, nationalCode);
    }
    this.router.navigate([this.creditUrlService.getOuterServicePath('credit-scoring', '/', '')], {
      queryParams: {
        callback,
        nationalCode,
      },
    });
  }

  navigateToCreditScoringServiceMiniApp(callback: string, nationalCode: string): void {
    const appUrl = this.creditEnvironment.appUrl![this.creditEnvironment.name as keyof CreditEnvironmentApiUrlInterface];
    const queryStringArr: string[] = [];
    const queryParams: { [key: string]: string } = {
      token: this.getMiniAppToken(),
      callback: this.convertToAbsoluteUrl('/mini-app/credit' + callback),
      nationalCode,
    };
    // check ios app
    if ((window as any).webkit && (window as any).webkit.messageHandlers && (window as any).webkit.messageHandlers.callbackHandler) {
      queryParams['callback'] = encodeURIComponent(
        'dgp://mydigipay.com/creditscoring?data=' +
          btoa(
            JSON.stringify({
              url: this.convertToAbsoluteUrl('/mini-app/credit' + callback),
            }),
          ),
      );
    }
    Object.keys(queryParams).forEach((key) => {
      queryStringArr.push(key + '=' + queryParams[key]);
    });
    const targetUrl = appUrl + '/credit-scoring-mini-app?' + queryStringArr.join('&');
    if ((window as any).webkit && (window as any).webkit.messageHandlers && (window as any).webkit.messageHandlers.callbackHandler) {
      (window as any).webkit.messageHandlers.callbackHandler.postMessage({
        function: 'CREDITـSCORING',
        payload: {
          url: targetUrl,
        },
      });
      return;
    } else {
      window.open(targetUrl, '_self');
      return;
    }
  }

  navigateToCreditScoringServiceExpress(callback: string, nationalCode: string): void {
    const appUrl = this.creditEnvironment.appUrl![this.creditEnvironment.name as keyof CreditEnvironmentApiUrlInterface];
    const queryStringArr: string[] = [];
    const queryParams: { [key: string]: string } = {
      token: this.getExpressToken(),
      callback: this.convertToAbsoluteUrl(callback),
      nationalCode,
    };
    Object.keys(queryParams).forEach((key) => {
      queryStringArr.push(key + '=' + queryParams[key]);
    });
    window.open(appUrl + '/credit-scoring-mini-app?' + queryStringArr.join('&'), '_self');
  }

  getTokenByEnvironment() {
    if (this.creditEnvironment.creditEnv === 'express') {
      return this.getExpressToken();
    }
    if (this.creditEnvironment.creditEnv === 'mini-app') {
      return this.getMiniAppToken();
    }
    return '';
  }

  navigateToSubscription(subscriptionPlanId: string): void {
    const params: Record<string, any> = {
      'callback-url': window.location.href,
      'plan-id': subscriptionPlanId,
      serviceType: serviceType.CREDIT,
    };
    if (this.getTokenByEnvironment()) {
      params['token'] = this.getTokenByEnvironment();
    }
    const queryParamsString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const appUrl = this.creditEnvironment.appUrl![this.creditEnvironment.name as keyof CreditEnvironmentApiUrlInterface];
    let subscriptionUrl = `${appUrl}/subscription/enter`;
    if (this.creditEnvironment.subscriptionUrl) {
      subscriptionUrl = this.creditEnvironment.subscriptionUrl;
    }
    const finalUrl = `${subscriptionUrl}?${queryParamsString}`;
    window.location.replace(finalUrl);
  }
}
