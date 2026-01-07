import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import {
  ActivityApiDetail, ActivityTransformedDetail,
  GetSettlementDetailApiResponse,
  GetSettlementDetailTransformedResponse
} from './response-models/get-settlement-detail.response';
import { GetSettlementPreviewResponse } from './response-models/get-settlement-preview.response';
import { FeeInitResponse } from './response-models/fee-init.response';
import { SearchOrder } from '../shared/basic-models/search-order';
import { SearchRestriction } from '../shared/basic-models/search-restriction';
import { map } from 'rxjs/operators';
import { convertDecimalToRgb } from '../../../utils/colors';
import { GetSettlementListResponse } from './response-models/get-settlement-list.response';
import { GetSettlementRulesResponse } from './response-models/get-settlement-rules.response';

@Injectable({
  providedIn: 'root'
})
export class EarlySettlementApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getDetail(trackingCode: string): Observable<GetSettlementDetailTransformedResponse> {
    return super.get(`${this.baseUrl}/settlements/${trackingCode}`)
      .pipe(map<GetSettlementDetailApiResponse, GetSettlementDetailTransformedResponse>((response) => {
          const newDetail = this.transformActivityInfo(response.details);
          const transformedResponse: GetSettlementDetailTransformedResponse = {
            ...response,
            details: newDetail,
            color: convertDecimalToRgb(response.color)
          };
          return transformedResponse;
        })
      );
  }

  transformActivityInfo(detail: ActivityApiDetail): ActivityTransformedDetail {
    if (Object.keys(detail).length > 0) {
      const result: ActivityTransformedDetail = [];
      Object.keys(detail).forEach((val, i) => {
        const key = Object.keys(detail[i])[0];
        const item = {
          key: key,
          value: detail[i][key].value,
          copyable: detail[i][key].copyable,
        };
        result.push(item);
      });
      return result;
    }

    return [];
  }

  getPreview(trackingCode: string, amount: number, ruleId: string): Observable<GetSettlementPreviewResponse> {
    return super.post(`${this.baseUrl}/settlements/${trackingCode}/preview`, {amount, ruleId});
  }

  settlementFeeInit(trackingCode: string, amount: number, ruleId: string): Observable<FeeInitResponse> {
    return super.put(`${this.baseUrl}/settlements/${trackingCode}/fee/init`, {
      updatedAmount: amount,
      ruleId: ruleId
    });
  }

  getList(
    page: number = 0,
    perPage: number = 5,
    count: boolean = true,
    restrictions: SearchRestriction[] = [],
    orders: SearchOrder[] = []
  ): Observable<GetSettlementListResponse> {
    return super.post(`${this.baseUrl}/settlements/search?page=${page}&size=${perPage}&count=${count}`, {
      restrictions,
      orders
    });
  }

  getRules(registrationId: string, trackingCode: string): Observable<GetSettlementRulesResponse> {
    return super.get(`${this.baseUrl}/rules/${registrationId}/fund-providers/${trackingCode}`);
  }

  getRegistrationIdFromDetail(): Observable<any> {
    return super.get(`${this.baseUrl}/ticket-info/detail`);
  }
}
