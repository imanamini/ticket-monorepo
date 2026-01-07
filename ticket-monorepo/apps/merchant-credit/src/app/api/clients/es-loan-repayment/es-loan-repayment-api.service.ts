import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';
import { SearchRestriction } from '../shared/basic-models/search-restriction';
import { SearchOrder } from '../shared/basic-models/search-order';
import { GetEsLoanRepaymentListResponse } from './models/get-es-loan-repayment-list.response.model';
import { GetEsLoanRepaymentPenaltyResponse } from './models/get-es-loan-repayment-penalty.response.model';

@Injectable({
  providedIn: 'root'
})
export class EsLoanRepaymentApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getSettlementList(
    page: number = 0,
    perPage: number = 5,
    restrictions: SearchRestriction[] = [],
    orders: SearchOrder[] = []
  ): Observable<GetEsLoanRepaymentListResponse> {
    return super.post(`${this.baseUrl}/settlements/search?page=${page}&size=${perPage}`, {
      restrictions,
      orders
    });
  }

  getRepaymentPenaltyAmount(trackingCode: string): Observable<GetEsLoanRepaymentPenaltyResponse> {
    return super.get(`${this.baseUrl}/es-loan/repayments/${trackingCode}`);
  }
}


