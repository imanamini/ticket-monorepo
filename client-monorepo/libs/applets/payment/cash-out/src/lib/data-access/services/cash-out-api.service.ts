import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable, switchMap } from 'rxjs';
import { FeeChargeApiResponse, WalletInfoResponse } from '../models/wallet-info-response.model';
import { WalletCashOutByPanRegisterRequest } from '../models/wallet-cash-out-by-pan-register.model';
import { sanitizeCashOutUrl } from '../utils/sanitize-cash-out-url';
import { CashOutResult } from '../models/cash-out.model';

@Injectable({
  providedIn: 'root'
})
export class CashOutApiService {
  private readonly api = inject(ApiService);

  getWalletInfo(): Observable<WalletInfoResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/cash-out/card');
    return this.api.call<WalletInfoResponse>(request);
  }

  getFeeChargeOfCashOutToCard(amount: number): Observable<FeeChargeApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/cash-out/card/estimated-fee');
    request.setParams({ amount });
    return this.api.call<FeeChargeApiResponse>(request);
  }

  registerCashOutByPanRequest(req: WalletCashOutByPanRegisterRequest): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'wallets/cash-out/register/card', req);
    return this.api.call<WalletCashOutByPanRegisterRequest>(request);
  }

  registerCashOut(req: WalletCashOutByPanRegisterRequest): Observable<any> {
    return this.registerCashOutByPanRequest(req).pipe(
      switchMap((registerResponse) => {
        const url: string = sanitizeCashOutUrl(registerResponse.detailUrl);
        const request = new RequestBuilder(RequestTypeEnum.GET, url);
        return this.api.call<CashOutResult>(request);
      })
    );
  }
}
