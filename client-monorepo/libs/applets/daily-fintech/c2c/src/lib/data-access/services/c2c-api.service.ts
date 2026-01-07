import { Injectable, signal } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { CheckCardRequest } from '../models/check-card-request.interface';
import { CardCheckResponse } from '../models/card-check-response.interface';
import { PaymentResultInterface } from '@client-monorepo/payment/purchase';
import { CardToCardRequest } from '../models/card-to-card-request.interface';
import { CardPaymentConfig } from '../models/card-payment-config.interface';
import { CardPaymentConfigResponse } from '../models/card-payment-config-response';
import { CardRecommendationConfigResponse } from '../models/card-recommendation-config-response';
import { CardToCardRecommendationResponse } from '../models/card-to-card-recommendation-response';
import { DynamicPasswordRequest } from '@client-monorepo/daily-fintech/bank-card';
import { DynamicPasswordResponse } from '@client-monorepo/daily-fintech/bank-card';
import { CardVerifyRequest } from '../models/card-verify-request';
import { C2cFrequentTransactionResponse } from '../models/c2c-frequent-transaction-response';

@Injectable({
  providedIn: 'root',
})
export class C2cApiService {
  /**
   * Default timeout of c2c APIs
   */
  timeout = signal(30000);
  constructor(private apiService: ApiService) {}

  checkCardTransferKyc(params: CheckCardRequest): Observable<CardCheckResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'cards/check', params);
    return this.apiService.call<CardCheckResponse>(request);
  }

  cardToCardTransfer(params: CardToCardRequest): Observable<PaymentResultInterface> {
    const header = { timeout: '' + this.timeout(), 'Digipay-Version': '2025-06-01' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'payments/card', params);
    request = request.setHeader(header);
    return this.apiService.call<PaymentResultInterface>(request);
  }

  getAmountConfig(params: CardPaymentConfig): Observable<CardPaymentConfigResponse> {
    const headers = { 'Digipay-Version': '2025-06-01' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'payments/card/config', params);
    request = request.setHeader(headers);
    return this.apiService.call<CardPaymentConfigResponse>(request);
  }

  getRecommendationConfig(): Observable<CardRecommendationConfigResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `recommendations/4/config`);
    return this.apiService.call<CardRecommendationConfigResponse>(request);
  }

  getRecommendation(): Observable<C2cFrequentTransactionResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `recommendations/4`);
    return this.apiService.call<CardToCardRecommendationResponse>(request);
  }

  deleteRecommendation(id: string): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.DELETE, `recommendations/4/${id}`);
    return this.apiService.call<GenericApiResponse>(request);
  }

  editRecommendation(params: any): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.PUT, `recommendations/4`, params);
    return this.apiService.call<GenericApiResponse>(request);
  }

  requestDynamicPassword(params: DynamicPasswordRequest, timeout?: number): Observable<DynamicPasswordResponse> {
    const headers = { 'Digipay-Version': '2025-06-01' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'cards/otp', params);
    request = request.setHeader(headers);
    return this.apiService.call<DynamicPasswordResponse>(request);
  }

  verifyCardApi(params: CardVerifyRequest): Observable<any> {
    const headers = { 'Digipay-Version': '2025-06-01' };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'cards/verify', params);
    request = request.setHeader(headers);
    return this.apiService.call<any>(request);
  }
}
