import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetProfileResponse } from './es-loan-profile.model';
import { BaseHttpClient } from '../base-http-client';
import { SearchRestriction } from '../shared/basic-models/search-restriction';
import { SearchOrder } from '../shared/basic-models/search-order';
import { GetSettlementListResponse } from '../early-settlement/response-models/get-settlement-list.response';

@Injectable({
  providedIn: 'root'
})
export class EsLoanDashboardApiService  extends BaseHttpClient {
baseUrl : string = 'merchant/credit';
  getProfile(): Observable<GetProfileResponse> {
    return super.get( `${this.baseUrl}/profile`);
  }

  getSettlementList(
    page: number = 0,
    perPage: number = 5,
    restrictions: SearchRestriction[] = [],
    orders: SearchOrder[] = []
  ): Observable<GetSettlementListResponse> {
    return super.post(`${this.baseUrl}/settlements/search?page=${page}&size=${perPage}`, {
      restrictions,
      orders
    });
  }
}
