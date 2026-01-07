import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { CardListResponse } from '../models/card-list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentCardApiService {
  private apiService = inject(ApiService);

  private removePromotions(response: CardListResponse): CardListResponse {
    response.data = response.data.filter((item) => !!item.card?.mainValue);
    return response;
  }

  getDebitWallets(): Observable<CardListResponse> {
    return this.apiService
      .call<CardListResponse>(new RequestBuilder(RequestTypeEnum.GET, 'wallets/setting'))
      .pipe(map(this.removePromotions));
  }

  getCreditWallets(): Observable<CardListResponse> {
    return this.apiService
      .call<CardListResponse>(new RequestBuilder(RequestTypeEnum.GET, 'credit/users/wallet-cards'))
      .pipe(map(this.removePromotions));
  }

  getBnplWallets(): Observable<CardListResponse> {
    return this.apiService
      .call<CardListResponse>(new RequestBuilder(RequestTypeEnum.GET, 'credit/users/wallet-cards/bnpl'))
      .pipe(map(this.removePromotions));
  }

  getSavedBankCards(): Observable<CardListResponse> {
    return this.apiService
      .call<CardListResponse>(new RequestBuilder(RequestTypeEnum.GET, 'cards/setting'))
      .pipe(map(this.removePromotions));
  }
}
