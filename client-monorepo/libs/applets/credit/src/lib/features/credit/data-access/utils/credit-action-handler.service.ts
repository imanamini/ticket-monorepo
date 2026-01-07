import { Inject, inject, Injectable } from '@angular/core';
import { Action, RedirectAction } from '../models/action';
import { ActionType } from '../models/action-type';
import { Router } from '@angular/router';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { RedirectionTypeEnum } from '../models/redirection-type.enum';
import { CreditActionHandlerResultInterface, CreditHandleTypeEnum } from '../models/credit-action-handler-result.interface';

@Injectable({
  providedIn: 'root',
})
export class CreditActionHandlerService {
  router = inject(Router);
  ngxHybridService = inject(NgxHybridService);
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  handle(action: Action): Promise<CreditActionHandlerResultInterface> {
    switch (action.type) {
      case ActionType.REDIRECT:
        return this.handelRedirectAction(action);
    }
  }

  private handelRedirectAction(action: RedirectAction): Promise<CreditActionHandlerResultInterface> {
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
    const state = action.payload.params ?? {};
    const replaceUrl = action.payload.replaceUrl ?? false;
    url = this.extractParamsFromUrl(url)['url'];
    const urlWithParams = this.addQueryParamToUrl(url, params);
    switch (redirectionType) {
      case RedirectionTypeEnum.auto:
        if (this.isExternalUrl(url)) {
          if (this.ngxHybridService.isHybrid()) {
            this.ngxHybridService.openUrlInHybrid(urlWithParams, hybridCloseAction);
            return new Promise((resolve) =>
              resolve({
                result: true,
                handleType: CreditHandleTypeEnum.instance,
              }),
            );
          }
          window.open(urlWithParams, '_blank');
          return new Promise((resolve) => resolve({ result: true, handleType: CreditHandleTypeEnum.newTab }));
        } else {
          return new Promise((resolve) => {
            this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
              resolve({
                result: true,
                handleType: CreditHandleTypeEnum.self,
              });
            });
          });
        }
      case RedirectionTypeEnum.blank:
        if (!this.isExternalUrl(url)) {
          url = this.fixInternalUrl(url);
        }
        if (this.ngxHybridService.isHybrid()) {
          this.ngxHybridService.openUrlInHybrid(urlWithParams, hybridCloseAction);
          return new Promise((resolve) =>
            resolve({
              result: true,
              handleType: CreditHandleTypeEnum.instance,
            }),
          );
        }
        window.open(urlWithParams, '_blank');
        return new Promise((resolve) => resolve({ result: true, handleType: CreditHandleTypeEnum.newTab }));
      case RedirectionTypeEnum.self:
        if (this.isExternalUrl(url)) {
          window.location.href = urlWithParams;
          return new Promise((resolve) => resolve({ result: true, handleType: CreditHandleTypeEnum.self }));
        }
        return new Promise((resolve) => {
          this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
            resolve({ result: true, handleType: CreditHandleTypeEnum.self });
          });
        });
      case RedirectionTypeEnum.self_instance:
        if (this.isExternalUrl(url)) {
          if (this.ngxHybridService.isHybrid()) {
            this.ngxHybridService.openUrlInHybrid(urlWithParams, hybridCloseAction);
            return new Promise((resolve) =>
              resolve({
                result: true,
                handleType: CreditHandleTypeEnum.instance,
              }),
            );
          }
          window.location.href = urlWithParams;
          return new Promise((resolve) => resolve({ result: true, handleType: CreditHandleTypeEnum.self }));
        }
        return new Promise((resolve) => {
          this.router.navigate([url], { queryParams: params, state, replaceUrl }).then(() => {
            resolve({ result: true, handleType: CreditHandleTypeEnum.self });
          });
        });
      default:
        return new Promise((resolve) => resolve({ result: false }));
    }
  }

  private isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  private fixInternalUrl(url: string | string[]): string {
    let finalUrl = this.environment['base_url'];
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

  private extractParamsFromUrl(url: string): {
    url: string;
    params: { [key: string]: string };
  } {
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
}
