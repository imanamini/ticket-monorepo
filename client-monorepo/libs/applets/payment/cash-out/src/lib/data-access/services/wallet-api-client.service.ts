import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { WalletTransferModel } from '../models/wallet-transfer.model';
import { WalletTransferResponse } from '../models/wallet-transfer-response.model';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { UserDetailResponse } from '../models/user-detail.response';

@Injectable({
  providedIn: 'root',
})
export class WalletApiClient {
  constructor(private apiService: ApiService) {}

  getWalletTransfer(): Observable<WalletTransferModel> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/transfer');
    return this.apiService.call<WalletTransferModel>(request);
  }

  getTransferTicket(amount: string, destinationCellNumber: string): Observable<WalletTransferResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'wallets', {
      amount,
      destCellNumber: destinationCellNumber,
    });
    return this.apiService.call<WalletTransferResponse>(request);
  }

  getWalletBalance(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/balance');
    return this.apiService.call<any>(request);
  }

  transfer(ticket: string): Observable<PaymentResult> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'wallets/pay', {
      type: 'wallet',
      ticket,
    });
    return this.apiService.call<PaymentResult>(request);
  }

  payByWallet(
    relativePayUrl: string,
    ticket: string,
  ): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, relativePayUrl, {
      type: 'wallet',
      ticket,
    });
    return this.apiService.call<any>(request);
  }

  getUserDetail(cellNumber: string): Observable<UserDetailResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `users/${cellNumber}`);
    return this.apiService.call<UserDetailResponse>(request);
  }
}
