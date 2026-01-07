import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { FeeChargeApiResponse, WalletInfoResponse } from '../models/wallet-info-response.model';
import { WalletCashOutByPanRegisterRequest } from '../models/wallet-cash-out-by-pan-register.model';

@Injectable({
  providedIn: 'root',
})
export class CashOutClientService {
  constructor(private apiService: ApiService) {}

  getWalletInfo(): Observable<WalletInfoResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/cash-out/card');
    return this.apiService.call<WalletInfoResponse>(request);
  }

  getFeeChargeOfCashoutToCard(amount: number): Observable<FeeChargeApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/cash-out/card/estimated-fee?amount=' + amount);
    return this.apiService.call<FeeChargeApiResponse>(request);
  }

  registerCashOutByPanRequest(req: WalletCashOutByPanRegisterRequest): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'wallets/cash-out/register/card', req);
    return this.apiService.call<WalletCashOutByPanRegisterRequest>(request);
  }

  getWithCustomUrl<T>(url: string): Observable<T> {
    const request = new RequestBuilder(RequestTypeEnum.GET, url);
    return this.apiService.call<T>(request);
  }
}
