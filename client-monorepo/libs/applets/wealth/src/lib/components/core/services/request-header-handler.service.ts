import { HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { AUTH_TOKEN_KEY, WEALTH_TOKEN } from '../../utils/variables';
import { EGeneralErrorPage } from '../../../data-access/models/general-error-page.enum';
import {
  CHANGE_EXPIRE_PASSWORD_API,
  GET_DPX_USER_ID_API,
  REFRESH_TOKEN_API,
  SESSIONS_API,
  WEALTH_LOGIN_DGP_API,
} from '../../../data-access/constants/api';
import { TRANSACTIONS_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { SKIP_BASIC_TOKEN } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class RequestHeaderHandlerService {
  protected token: string = '';
  navigationService = inject(WealthNavigationService);

  constructor(private apiConfigService: NgxApiConfigService) {}

  updateHeader(request: any) {
    const wealthToken = JSON.parse(localStorage.getItem(WEALTH_TOKEN))?.accessToken;
    const storage = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storage) {
      this.token = JSON.parse(storage)?.auth?.access;
    }
    const headersConfig: any = {
      Agent: this.apiConfigService.getApiConstants().agent,
      'W-Authorization': `Bearer ${wealthToken}`,
    };

    if (
      request.url.includes(REFRESH_TOKEN_API) ||
      request.url.includes(WEALTH_LOGIN_DGP_API) ||
      request.url.includes(CHANGE_EXPIRE_PASSWORD_API) ||
      request.url.includes(GET_DPX_USER_ID_API)
    ) {
      delete headersConfig['W-Authorization'];
    }

    if (!this.navigationService?.getCurrentUrl()?.includes('home')) {
      headersConfig['x-clientpage'] = this.updateXClientPage(this.navigationService.getCurrentUrl());
    }

    // Set Accept header for JSON response type
    if (request.responseType === 'json') {
      headersConfig.Accept = 'application/json';
      headersConfig['Content-Type'] = 'application/json';
    }

    // Set Agent header to 'PWA' if it's specified in the request
    if (request.headers.get('Agent') === 'PWA') {
      headersConfig.Agent = 'PWA';
    }

    // Add Authorization header if token is available and needed
    if (this.token && this.doesRequestNeedsAuthorizationHeader(request)) {
      headersConfig.Authorization = `Bearer ${this.token}`;
    }

    // Add Basic Auth header if needed
    if (this.doesRequestNeedsBasicToken(request) && !request.context.get(SKIP_BASIC_TOKEN)) {
      headersConfig.Authorization = this.apiConfigService.getBasicAuthHeader();
    }

    if (request.url?.includes('fund/agreement-customer-file')) {
      headersConfig.Accept = 'application/pdf';
      headersConfig['Content-Type'] = 'application/pdf';
      headersConfig['responseType'] = 'blob';
    }

    // Clone the request with updated headers and return
    return request.clone({
      setHeaders: headersConfig,
    });
  }

  private doesRequestNeedsAuthorizationHeader(req: HttpRequest<any>) {
    return this.doesRequestNeedsPaymentTicket(req) || this.isBasicToken(req.url) ? false : true;
  }

  private doesRequestNeedsBasicToken(req: HttpRequest<any>) {
    return this.isBasicToken(req.url);
  }

  private doesRequestNeedsPaymentTicket(req: HttpRequest<any>) {
    return req.headers.has('ticket') && req.headers.get('ticket');
  }

  private isBasicToken(url: string): boolean {
    const basicUrls = ['token/refresh', 'send-sms', 'activate', 'users/login'];
    const shouldHaveBasic = basicUrls.some((address) => url.includes(address));
    return shouldHaveBasic;
  }

  private updateXClientPage(url: string): string {
    // ? Transactions
    if (url?.includes(TRANSACTIONS_ROUTE)) {
      return EGeneralErrorPage.Transactions;
    }

    // ? Default
    else {
      return url.split('?')[0];
    }
  }

  private needDGPToken(url: string): boolean {
    if (url.includes(WEALTH_LOGIN_DGP_API) || url.includes(SESSIONS_API)) return true;
    return false;
  }
}
