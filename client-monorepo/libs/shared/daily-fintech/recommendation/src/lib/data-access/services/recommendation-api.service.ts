import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { RECOMMENDATION_TYPES } from '../model/recommendation-types';
import { RecommendationResponse } from '../model/recommendation.response.model';
import { RecommendationCharitiesResponseModel } from '../model/recommendation-charities.response.model';

@Injectable({
  providedIn: 'root',
})
export class RecommendationApiService {
  constructor(private apiService: ApiService) {}

  getRecommendations(type: RECOMMENDATION_TYPES): Observable<RecommendationResponse> {
    let request: RequestBuilder;

    if (type === RECOMMENDATION_TYPES.CHARITY) {
      request = new RequestBuilder(RequestTypeEnum.GET, `donations/recommendations`);
      return this.apiService.call<RecommendationCharitiesResponseModel>(request).pipe(
        map((res) => ({
          result: res.result,
          recommendations: res.items.map((item) => ({
            colors: [item.color],
            trackingCode: item.trackingCode,
            imageId: item.imageId,
            title: item.title,
            desc: item.desc,
            id: item.desc,
            amount: item.amount,
            organization: item.organization,
          })),
        })),
      );
    } else {
      request = new RequestBuilder(RequestTypeEnum.GET, `recommendations/${type}`);
      return this.apiService.call<RecommendationResponse>(request);
    }
  }

  updateStoredBill(
    type: RECOMMENDATION_TYPES,
    params: {
      id: string;
      alias: string;
      pinned: boolean;
    },
  ): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.PUT, `recommendations/${type}`, params);
    return this.apiService.call<any>(request);
  }

  deleteBill(type: RECOMMENDATION_TYPES, id: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.DELETE, `recommendations/${type}/${id}`);
    return this.apiService.call<any>(request);
  }

  getRecommendationsBasedOnBillType(type: RECOMMENDATION_TYPES, billType: string): Observable<RecommendationResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `recommendations/${type}?billType=${billType}`);
    return this.apiService.call<RecommendationResponse>(request);
  }
}
