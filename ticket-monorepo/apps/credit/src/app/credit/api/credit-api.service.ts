import { CreditHttpService } from './credit-http.service';
import { Observable } from 'rxjs';
import { CreditInfoResponse } from './purchase/credit-info-response.model';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { StorageService } from '../core/services/storage.service';
import { OfferInfoResponse } from './offer/offer-info-response.model';
import { CreditPurchaseSummaryResponse } from './purchase/credit-purchase-summary.response';
import { PurchaseRouteInfoResponse } from './purchase/purchase-route-info.response';
import { GetUserProfileResponse } from './get-user-profile.response';
import { GetStandardCardsResponse } from './purchase/get-standard-cards.response';
import { GetCreditDetailResponse } from './purchase/get-credit-detail.response';
import { InAppTacResponse } from './tac/in-app-tac-response';
import { CallForOtpPayload, CallForOtpResponse } from './tac/call-for-otp';
import { VerifyOtpPayload } from './tac/verify-otp';
import { ServiceType } from '../core/models/serviceType.model';
import { InstallmentPayLinkResponse } from './installment-pay-link/installment-pay-link.response';
import {
  RegisterIplTicketBody,
  RegisterIplTicketDetail,
  RegisterIplTicketResponse
} from './installment-pay-link/register-ipl-ticket';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { CampaignWalletResponse } from './models/bnpl/campaigns/campaign-wallet.response';
import { CampaignWalletRequest } from './models/bnpl/campaigns/campaign-wallet.request';
import { RefererShortKey } from '../installment-pay-link/models/referer.model';
import { IplReceiptQueryParamKey } from '../installment-pay-link/data-access/ipl-receipt';

@Injectable({
  providedIn: 'root'
})
export class CreditApiService {
  constructor(
    private http: CreditHttpService,
    private storage: StorageService,
    private apiConfigService: NgxApiConfigService,
  ) {
  }

  getUserProfile(): Observable<GetUserProfileResponse> {
    return this.http.get('users/profile', null, this.getHeaders());
  }

  getTicketInfo(ticket: string, creditAmount = null): Observable<CreditInfoResponse> {
    return this.http.get('purchases/credit/info/' + ticket + (creditAmount !== null ? '?creditAmount=' + creditAmount : ''),
      new HttpParams(),
      this.getHeaders());
  }

  registerVolunteer(body) {
    return this.http.post('volunteers', body, this.getHeaders());
  }

  getBanks(): Observable<any> {
    return this.http.get('banks', null, this.getHeaders());
  }

  getContract(totalAmount: number, creditAmount: number, fundProviderCode: number, creditId: string) {
    const ticket = this.storage.get('ticket');
    return this.http.post(`credit/purchases/contracts/${ticket}`, {
      amount: totalAmount,
      fundProviderCode,
      creditId,
      creditAmount
    }, this.getHeaders(), 'text');
  }

  getCreditOfferInfo(serviceType: ServiceType, amount: number): Observable<OfferInfoResponse> {
    return this.http.get(`credit/offer?serviceType=${serviceType}&amount=${amount}`, null, this.getHeaders());
  }

  getPurchaseSummary(ticketId: string): Observable<CreditPurchaseSummaryResponse> {
    return this.http.get(`credit/purchases/summary/${ticketId}`, null, this.getHeaders());
  }

  getPurchaseRouteInfo(ticketId: string): Observable<PurchaseRouteInfoResponse> {
    return this.http.get(`credit/purchases/route/info/${ticketId}`, null, this.getHeaders());
  }

  preparePurchase(fundProviderBusinessId: string, creditId: string, creditAmount: number, couponCode?: string) {
    const ticket = this.storage.get('ticket');

    const queryStringArray: string[] = [];
    if (creditAmount !== null) {
      queryStringArray.push('creditAmount=' + creditAmount);
    }
    if (couponCode) {
      queryStringArray.push('couponCode=' + couponCode);
    }
    const queryString = queryStringArray.length > 0 ? '?' + queryStringArray.join('&') : '';

    return this.http.get(`credit/purchases/prepare/${fundProviderBusinessId}/${creditId}/${ticket}${queryString}`,
      null, this.getHeaders());
  }

  getByUrl<T>(redirectUrl: string): Observable<T> {
    return this.http.get(redirectUrl, null, this.getHeaders(), 'json', true);
  }

  getBnplTac(): Observable<any> {
    return this.http.get(`bnpl/tac/general`, null, this.getHeaders());
  }

  acceptBnplTac(): Observable<any> {
    return this.http.post('bnpl/tac/general', {}, this.getHeaders());
  }

  registerBnpl(body: CampaignWalletRequest): Observable<CampaignWalletResponse> {
    return this.http.post('credit/campaigns/create/wallet', body, this.getHeaders());
  }

  getHtml(relativeUrl) {
    const headers = this.getHeaders().set('Accept', 'text/html,application/xhtml+xml;');
    return this.http.get(relativeUrl, null, headers, 'text');
  }

  getStandardCards(): Observable<GetStandardCardsResponse> {
    return this.http.get('credit/fund-providers/card', null, this.getHeaders());
  }

  getCardWalletDetail(fundProviderBusinessId: string, creditAmount: number = null, creditId: string = null, couponCode?: string): Observable<GetCreditDetailResponse> {
    const ticket = this.storage.get('ticket');

    const queryStringArray: string[] = [];
    if (creditAmount !== null) {
      queryStringArray.push('creditAmount=' + creditAmount);
    }
    if (creditId !== null) {
      queryStringArray.push('creditId=' + creditId);
    }
    if (couponCode) {
      queryStringArray.push('couponCode=' + couponCode);
    }
    const queryString = queryStringArray.length > 0 ? '?' + queryStringArray.join('&') : '';

    return this.http.get(
      `credit/purchases/detail/${fundProviderBusinessId}/${ticket}` + queryString,
      null,
      this.getHeaders()
    );
  }

  getPurchaseContract(creditId: string, creditAmount: number) {
    return this.http.get(`credit/agreement/preview/${creditId}/0?creditAmount=${creditAmount}`, null, this.getHtmlHeader(), 'text');
  }

  inAppTac(ticket: string): Observable<InAppTacResponse> {
    return this.http.post('users/in-app/tac', {}, new HttpHeaders().set('ticket', ticket));
  }

  callForOtp(payload: CallForOtpPayload): Observable<CallForOtpResponse> {
    return this.http.post('users/otp', payload, this.getHeaders());
  }

  verifyOtp(payload: VerifyOtpPayload) {
    return this.http.post('users/otp/verify', payload, this.getHeaders());
  }

  getUserInfoForPayByLink(uuid: string, referer: string | null): Observable<InstallmentPayLinkResponse> {
    const queryParam = referer ? `?${RefererShortKey}=${referer}` : '';
    return this.http.get(`installment/payment-orders/credit-link/debt-summary/${uuid}${queryParam}`);
  }

  registerInstallmentPayLinkTicket(uuid: string, token: string, referer: string | null = null, ticketDetails: RegisterIplTicketDetail[] | null = null): Observable<RegisterIplTicketResponse> {
    const queryParam = referer ? `?${RefererShortKey}=${referer}` : '';

    const payload: RegisterIplTicketBody = {
      callbackUrl: `${window.location.origin}/credit/pay-receipt?${IplReceiptQueryParamKey}=${uuid}`,

    };

    if (ticketDetails) {
      payload.ticketRequestDetails = ticketDetails;
    }

    return this.http.post(`installment/payment-orders/credit-link/ticket/${uuid}${queryParam}`, payload, this.getBearerTokenHeader(token));
  }

  getBearerTokenHeader(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Agent', this.apiConfigService.getApiConstants().agent);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('ticket', this.storage.get('ticket') || '').set('Content-Type', 'application/json');
  }

  private getHtmlHeader(): HttpHeaders {
    return new HttpHeaders().set('ticket', this.storage.get('ticket') || '').set('Content-Type', 'text/html');
  }
}
