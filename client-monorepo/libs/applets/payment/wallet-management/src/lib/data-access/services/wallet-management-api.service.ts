import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { BalanceInformationResponseInterface, GiftCardsResponseInterface } from '../models/balance.interface';
import { RedeemResponseInterface } from '../models/redeem.interface';
import { VoucherDetail, VoucherResponseInterface } from '../models/voucher.response.interface';

@Injectable({
  providedIn: 'root', 
})
export class WalletManagementApiService {
  private apiService = inject(ApiService);

  public getBalanceInformation(): Observable<BalanceInformationResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/users/total-balance');
    return this.apiService.call<BalanceInformationResponseInterface>(request);
  }

  public getBalances(): Observable<GiftCardsResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'wallets/users/balances');
    return this.apiService.call<GiftCardsResponseInterface>(request);
  }

  public redeemVouchers(voucherCode: string | null): Observable<RedeemResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `gift-cards/vouchers/redeem?voucherCode=${voucherCode}`);
    return this.apiService.call<RedeemResponseInterface>(request);
  }

  public getVouchers(): Observable<VoucherDetail[]> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'gift-cards/vouchers');
    return this.apiService.call<VoucherResponseInterface>(request).pipe(map((result: VoucherResponseInterface) => result.details));
  }

  public hideExpiredVouchers(voucherCode: string) {
    const request = new RequestBuilder(RequestTypeEnum.POST, `gift-cards/vouchers/hide?serial=${voucherCode}`);
    return this.apiService.call<RedeemResponseInterface>(request);
  }
}
