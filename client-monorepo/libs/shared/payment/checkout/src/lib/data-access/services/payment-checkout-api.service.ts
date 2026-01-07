import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { InAppTacResponse, TacResponse } from '@client-monorepo/common/user';
import { PaymentResultInterface, TicketParams, TicketTypes } from '@client-monorepo/payment/purchase';
import { TgsSelectFeatureResponse } from '../models/tgs-select-feature-response';
import { TgsSelectFeatureBody } from '../models/tgs-select-feature-body';
import { WalletBalanceResponse } from '@client-monorepo/payment/wallet';
import { AppPayFeaturesResponse } from '../models/app-pay-features.response';
import { CreateAppPayTicketResponse } from '../models/create-app-pay-ticket.response';
import { PurchaseCreditInfoResponse } from '../models/purchase-credit-info.response';

@Injectable({
  providedIn: 'root',
})
export class PaymentCheckoutApiService {
  constructor(private apiService: ApiService) {}

  /**
   * Get app-pay ticket
   */
  getAppPayTicketApi(type: TicketTypes, data: TicketParams): Observable<CreateAppPayTicketResponse> {
    const body = { type, ...data };
    const request = new RequestBuilder(RequestTypeEnum.POST, '/app/app-pay/ticket', body);
    return this.apiService.call<CreateAppPayTicketResponse>(request);
  }

  /**
   * Get Features app-pay
   */
  getAppPayFeaturesApi(ticket: string, amount: number): Observable<AppPayFeaturesResponse> {
    const headers = { 'Digipay-Version': '2025-06-01' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'app/app-pay/features', { ticket, amount });
    request = request.setHeader(headers);
    return this.apiService.call<AppPayFeaturesResponse>(request);
  }

  /**
   * Select feature TGS
   */
  tgsSelectFeature(body: TgsSelectFeatureBody): Observable<TgsSelectFeatureResponse> {
    const header = { ticket: body.ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, '/app/app-pay/select', body);
    request = request.setHeader(header);
    return this.apiService.call<TgsSelectFeatureResponse>(request);
  }

  tgsPayByWallet(relativePayUrl: string, ticket: string): Observable<PaymentResultInterface> {
    const body = { type: 'wallet', ticket };
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, relativePayUrl, body);
    request = request.setHeader(header);
    return this.apiService.call<PaymentResultInterface>(request).pipe(
      map((response: any) => {
        // convert JSON string to an object
        if (response.payInfo && typeof response.payInfo === 'string') {
          response.payInfo = JSON.parse(response.payInfo);
        }
        return response;
      }),
    );
  }

  tac(ticket: string): Observable<TacResponse> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/in-app/tac');
    request = request.setHeader(header);
    return this.apiService.call<InAppTacResponse | any>(request);
  }

  tacAccept(ticket: string): Observable<TacResponse> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/in-app/tac/accept');
    request = request.setHeader(header);
    return this.apiService.call<TacResponse>(request);
  }

  getHtml(address: string, headers: { [p: string]: string | string[] }): Observable<any> {
    // todo check response type
    // responseType: 'text',
    const header = { Accept: 'text/html,application/xhtml+xml;', ...headers };
    let request = new RequestBuilder(RequestTypeEnum.GET, address);
    request = request.setHeader(header);
    return this.apiService.call<AppPayFeaturesResponse>(request);
  }

  getUpgWalletBalance(ticket: string): Observable<WalletBalanceResponse> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/balance');
    request = request.setHeader(header);
    return this.apiService.call<WalletBalanceResponse>(request);
  }

  getPurchaseCreditInfoApi(ticket: string): Observable<PurchaseCreditInfoResponse> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.GET, 'purchases/credit/info/' + ticket);
    request = request.setHeader(header);
    return this.apiService.call<PurchaseCreditInfoResponse>(request);
  }
}
