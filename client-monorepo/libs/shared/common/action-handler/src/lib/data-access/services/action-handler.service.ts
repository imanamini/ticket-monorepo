import { Inject, inject, Injectable, isDevMode } from '@angular/core';
import {
  Action,
  GoToC2CAction,
  GoToDiscountPLPAction,
  GoToServiceAction,
  OldAction,
  PayInstallmentAction,
  RedirectAction,
} from '../models/action';
import { ActionType } from '../models/action-type';
import { Router } from '@angular/router';
import { OLD_ACTION_ROUTES } from '../constants/old-action-routes';
import { SERVICE_ROUTES } from '../constants/service-routes';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { RedirectionTypeEnum } from '../models/redirection-type.enum';
import { RedirectPayload } from '../models/action-payload';
import { ActionHandlerResultInterface, HandleTypeEnum } from '../models/action-handler-result.interface';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { StorageService } from '@client-monorepo/common/utilities';
import { serviceTypeMapper } from '../models/pay-installment-payload';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Injectable({
  providedIn: 'root',
})
export class ActionHandlerService {
  router = inject(Router);
  ngxHybridService = inject(NgxHybridService);
  storageService = inject(StorageService);
  private eventManagementService = inject(EventManagementService);
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  handle(action: Action): Promise<ActionHandlerResultInterface> {
    switch (action.type) {
      case ActionType.REDIRECT:
        return this.handelRedirectAction(action);
      case ActionType.OLD_ACTION:
        return this.handleOldAction(action);
      case ActionType.GO_TO_SERVICE:
        return this.handleGoToService(action);
      case ActionType.GO_TO_C2C:
        return this.handleGoToC2C(action);
      case ActionType.PAY_INSTALLMENT:
        return this.handlePayInstallment(action);
      case ActionType.GO_TO_Discount_PLP:
        return this.handleGoToDiscountPLP(action);
    }
  }

  private handelRedirectAction(action: RedirectAction): Promise<ActionHandlerResultInterface> {
    let url = action.payload.url;
    if (action.payload.params && action.payload.params['external'] && !url?.startsWith('http')) {
      url = 'https://' + url;
    }
    const redirectionType = action.payload.type ?? RedirectionTypeEnum.auto;
    const hybridCloseAction = action.payload.hybridCloseAction ?? true;
    let params = action.payload.params ?? {};
    params = {
      ...params,
      ...this.extractParamsFromUrl(url)['params'],
    };
    const state = action.payload.state ?? {};
    const replaceUrl = action.payload.replaceUrl ?? false;
    url = this.extractParamsFromUrl(url)['url'];
    const urlWithParams = this.addQueryParamToUrl(url, params);
    switch (redirectionType) {
      case RedirectionTypeEnum.auto:
        if (this.isExternalUrl(url)) {
          return this.handleExternalAction(urlWithParams, hybridCloseAction);
        } else {
          return new Promise((resolve) => {
            this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
              resolve({ result: true, handleType: HandleTypeEnum.self });
            });
          });
        }
      case RedirectionTypeEnum.blank:
        if (!this.isExternalUrl(urlWithParams)) {
          url = this.fixInternalUrl(urlWithParams);
        } else {
          url = urlWithParams;
        }
        return this.handleExternalAction(url, hybridCloseAction);
      case RedirectionTypeEnum.self:
        if (this.isExternalUrl(url)) {
          window.location.href = urlWithParams;
          return new Promise((resolve) => resolve({ result: true, handleType: HandleTypeEnum.self }));
        }
        return new Promise((resolve) => {
          this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
            resolve({ result: true, handleType: HandleTypeEnum.self });
          });
        });
      case RedirectionTypeEnum.self_instance:
        if (this.isExternalUrl(url)) {
          if (this.ngxHybridService.isHybrid()) {
            return this.handleExternalAction(urlWithParams, hybridCloseAction);
          }
          window.location.href = urlWithParams;
          return new Promise((resolve) => resolve({ result: true, handleType: HandleTypeEnum.self }));
        }
        return new Promise((resolve) => {
          this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
            resolve({ result: true, handleType: HandleTypeEnum.self });
          });
        });
      default:
        return new Promise((resolve) => resolve({ result: false }));
    }
  }

  /**
   * is implemented to support goToAction method
   * has migrated of pwa and should get removed in future
   */
  private handleOldAction(action: OldAction): Promise<ActionHandlerResultInterface> {
    return new Promise((resolve, reject) => {
      if (!Object.prototype.hasOwnProperty.call(OLD_ACTION_ROUTES, action.payload.action)) {
        reject(new Error(`Action route not found: ${action.payload.action}`));
        return;
      }
      this.router
        .navigate([OLD_ACTION_ROUTES[action.payload.action as keyof typeof OLD_ACTION_ROUTES]])
        .then(() => resolve({ result: true, handleType: HandleTypeEnum.self }))
        .catch((error) => reject(new Error(`Navigation failed: ${error?.message || 'Unknown error'}`)));
    });
  }

  private handleGoToService(action: GoToServiceAction): Promise<ActionHandlerResultInterface> {
    return this.handelRedirectAction({
      type: ActionType.REDIRECT,
      payload: this.fixServiceUrl(SERVICE_ROUTES[action.payload.serviceId], action.payload.closeServiceUrl, action.payload.params),
    });
  }

  handleGoToC2C(action: GoToC2CAction): Promise<ActionHandlerResultInterface> {
    const payload = this.fixServiceUrl(SERVICE_ROUTES[FrequentServicesIdEnum.C2C]);
    return this.handelRedirectAction({
      type: ActionType.REDIRECT,
      payload: { ...payload, params: { ...payload.params, card: action.payload.cardNumber } },
    });
  }

  handleGoToDiscountPLP(action: GoToDiscountPLPAction): Promise<ActionHandlerResultInterface> {
    const title = action.payload.pageTitle.split(' ').join('_');
    let url = `/stores/products/uri/${action.payload.minDiscount}/${action.payload.maxDiscount}/${title}`;
    if (action.payload.productCategories) {
      const productCategories = action.payload.productCategories.join('_');
      url += `?categories=${productCategories}`;
    }
    if (action.payload.storeIds) {
      const storeIds = action.payload.storeIds.join('_');
      let separator = '?';
      if (url.includes('?')) {
        separator = '&';
      }
      url += `${separator}storeIds=${storeIds}`;
    }
    return this.handelRedirectAction({
      type: ActionType.REDIRECT,
      payload: { url },
    });
  }

  handlePayInstallment(action: PayInstallmentAction): Promise<ActionHandlerResultInterface> {
    const url = `/service/credit/installments-overview`;

    return this.handelRedirectAction({
      type: ActionType.REDIRECT,
      payload: { url, params: { serviceType: serviceTypeMapper[action.payload.serviceType], ...action.payload.params } },
    });
  }

  public isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  private fixInternalUrl(url: string | string[]): string {
    let finalUrl = this.environment['app_url'];
    if (Array.isArray(url)) {
      finalUrl += url.join('/');
    } else {
      finalUrl += url
        .split('/')
        .filter((part) => !!part)
        .join('/');
    }
    return finalUrl;
  }

  private fixServiceUrl(url: string, closeServiceUrl = '', params?: { [key: string]: string | number | boolean }): RedirectPayload {
    const baseUrl = url.split('?')[0];
    const redirectPayload = {
      url: baseUrl,
      type: this.isExternalUrl(url) ? RedirectionTypeEnum.blank : RedirectionTypeEnum.self,
      params: {
        ...this.extractParamsFromUrl(url)['params'],
        ...params,
      },
    };
    if (closeServiceUrl) {
      redirectPayload.params['closeServiceUrl'] = closeServiceUrl;
    }
    return redirectPayload;
  }

  private extractParamsFromUrl(url: string): { url: string; params: { [key: string]: string } } {
    const params = url.includes('?')
      ? url
          .split('?')[1]
          .split('&')
          .reduce((params, pair) => {
            const [key, value] = pair.split('=');
            return { ...params, [key]: value };
          }, {})
      : {};
    const final = url.includes('?') ? url.split('?')[0] : url;
    return {
      url: final,
      params,
    };
  }

  private addQueryParamToUrl(url: string, params: { [key: string]: string | number | boolean }): string {
    if (!params || !Object.keys(params).length) {
      return url;
    }
    return (
      url +
      '?' +
      Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&')
    );
  }

  handleExternalAction(url: string, closeAction = false): Promise<ActionHandlerResultInterface> {
    this.eventManagementService.sendEvents();
    if (this.ngxHybridService.isHybrid() && (url.startsWith('https://digikala.com') || url.startsWith('https://www.digikala.com'))) {
      window.open(url, '_blank');
      return new Promise((resolve) => resolve({ result: true, handleType: HandleTypeEnum.newTab }));
    }
    this.storageService.addResolveUrl(url);
    const resolverUrl = (isDevMode() ? this.environment['developing_app_url'] : this.environment['app_url']) + 'resolver.html';
    if (this.ngxHybridService.isHybrid()) {
      this.ngxHybridService.openUrlInHybrid(resolverUrl, closeAction);
      return new Promise((resolve) => resolve({ result: true, handleType: HandleTypeEnum.instance }));
    }
    window.open(resolverUrl, '_blank');
    return new Promise((resolve) => resolve({ result: true, handleType: HandleTypeEnum.newTab }));
  }
}
