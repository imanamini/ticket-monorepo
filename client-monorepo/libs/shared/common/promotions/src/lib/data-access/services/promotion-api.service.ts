import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum, SearchPayloadInterface } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { PromotionGroupInterface } from '../models/promotion-group.interface';
import { PromotionItemRestrictionEnum } from '../models/promotion-item-restriction.enum';
import { PromotionItemsSearchResponseInterface } from '../models/promotion-items-search-response.interface';
import { PromotionGroupListResponseInterface } from '../models/promotion-group-list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionApiService {
  apiService = inject(ApiService);
  getPromotionGroupList(): Observable<Array<PromotionGroupInterface>> {
    const request = new RequestBuilder(RequestTypeEnum.GET, '/app/store/promotion/group/all').enableCache(60 * 1000);
    return this.apiService.call<PromotionGroupListResponseInterface>(request).pipe(
      map((response) => {
        return response.groups;
      }),
    );
  }

  getPromotionGroup(promotionGroupId: string): Observable<PromotionGroupInterface | null> {
    return new Observable<PromotionGroupInterface | null>((observer) => {
      this.getPromotionGroupList().subscribe({
        next: (promotions) => {
          const item = promotions.find((group) => group?.uuid === promotionGroupId);
          observer.next(item ?? null);
          observer.complete();
        },
        error: (err) => {
          observer.error(err || new Error('Failed to get promotion group'));
          observer.complete();
        },
      });
    });
  }

  getPromotionItemsList(
    payload: SearchPayloadInterface<PromotionItemRestrictionEnum> | undefined = undefined,
  ): Observable<PromotionItemsSearchResponseInterface> {
    const { page = 0, size = 100, ...sendData } = payload ?? {};
    const request = new RequestBuilder(RequestTypeEnum.POST, `/app/store/promotion/item/search?page=${page}&size=${size}`, sendData);
    return this.apiService.call<PromotionItemsSearchResponseInterface>(request);
  }
}
