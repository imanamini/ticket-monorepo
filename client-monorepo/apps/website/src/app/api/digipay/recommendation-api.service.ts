import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecommendationResponse } from './models/recommendation/recommendation.response.model';
import { RECOMMENDATION_TYPES } from './models/recommendation/recommendation-types';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecommendationApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getRecommendations(type: RECOMMENDATION_TYPES): Observable<RecommendationResponse> {
    return super.get('recommendations/' + type).pipe(
      map((response: RecommendationResponse) => {
        response.recommendations = response.recommendations.map((r) => {
          if (r.operator) {
            // convert operatorId to string
            r.operator = '' + r.operator;
          }
          return r;
        });

        return response;
      }),
    );
  }

  updateStoredBill(
    type,
    params: {
      id: string;
      alias: string;
      pinned: boolean;
    },
  ): Observable<any> {
    return super.put('recommendations/' + type, params);
  }

  deleteBill(type, id): Observable<any> {
    return super.delete('recommendations/' + type + '/' + id);
  }

  getRecommendationsBasedOnType(type: RECOMMENDATION_TYPES, billType: string): Observable<RecommendationResponse> {
    return super.get('recommendations/' + type + '?billType=' + billType);
  }
}
