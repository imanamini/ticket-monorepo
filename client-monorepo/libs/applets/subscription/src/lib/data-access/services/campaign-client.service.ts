import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { PromotionBanner, UserCashbackResponse } from '@client-monorepo/common/subscription';

@Injectable({
  providedIn: 'root',
})
export class CampaignClientService {
  apiService = inject(ApiService);

  getTransactionPromotion(transactionType: number): Observable<{ promotionBanner: PromotionBanner }> {
    const request = new RequestBuilder(RequestTypeEnum.GET, '/promotion/banner/' + transactionType);
    return this.apiService.call<{ promotionBanner: PromotionBanner }>(request);
  }

  getUserCashbackApi(): Observable<UserCashbackResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'campaigns/app-subscription/cashback');
    return this.apiService.call<UserCashbackResponse>(request);
  }
}
