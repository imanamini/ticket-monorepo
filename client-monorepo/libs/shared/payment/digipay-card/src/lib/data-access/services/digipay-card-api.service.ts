import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { inject, Injectable, signal } from '@angular/core';
import { DigipayCard, DigipayCardListResponse } from '../models/digipay-card-list-response.interface';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DigipayCardApiService {
  private apiService = inject(ApiService);

  cards = signal<DigipayCard[]>([]);

  getCardList(): Observable<DigipayCardListResponse> {
    return this.apiService.call<DigipayCardListResponse>(new RequestBuilder(RequestTypeEnum.GET, 'digicard/cards/get-card')).pipe(
      tap((res) => {
        if (res && res.cardResults) {
          this.cards.set(res.cardResults);
        }
        return res;
      }),
    );
  }
}
