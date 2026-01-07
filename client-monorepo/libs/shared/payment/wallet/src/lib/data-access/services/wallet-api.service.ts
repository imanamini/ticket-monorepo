import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { WalletBalanceResponse } from '../models/wallet-balance.response';
import { PaymentResultInterface } from '@client-monorepo/payment/purchase';
import { InAppTacResponse } from '@client-monorepo/common/user';

@Injectable({
  providedIn: 'root',
})
export class WalletApiService {
  apiService = inject(ApiService);

  getWalletBalance(): Observable<WalletBalanceResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/balance');
    return this.apiService.call(request);
  }

  payByWallet(relativePayUrl: string, ticket: string): Observable<PaymentResultInterface> {
    const params = {
      type: 'wallet',
      ticket,
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, relativePayUrl, params);
    return this.apiService.call<PaymentResultInterface>(request);
  }

  /**
   * This probability is checked to be no greater than the assumed value
   */
  checkForCashInInput(amount: number, ticket: string): Observable<ApiResultInterface> {
    const header = { ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, '/wallets/cash-in/cap', { amount });
    request = request.setHeader(header);
    return this.apiService.call<InAppTacResponse | any>(request);
  }

  walletFlag(ticket: string, module: 'ICP' | 'CahInAndPay' | 'OldCashIn'): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `purchases/${ticket}/wallet-flag?module=${module}`);
    return this.apiService.call<InAppTacResponse | any>(request);
  }
}
