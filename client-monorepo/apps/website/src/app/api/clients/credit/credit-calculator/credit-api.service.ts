import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../../base-http-client';
import { Observable } from 'rxjs';
import { GetPlanGroupsResponse } from '../../../../ui/models/credit/get-plan-groups.response';
import { HttpClient } from '@angular/common/http';
import { CreditPlanDetailResponse } from '../../../../ui/models/credit/credit-plan-detail.response';
import { map } from 'rxjs/operators';
import { UserType } from '../../../../website/pages/credit/c-credit-club/models/user-type-model';

@Injectable({
  providedIn: 'root',
})
export class CreditApiService extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getPlanGroups(userType?: UserType): Observable<GetPlanGroupsResponse> {
    return super.get(`website/credit/calculator/plans`, userType && { userType });
  }

  getPlanDetail(planId: string): Observable<CreditPlanDetailResponse> {
    return super.get(`website/credit/plans/receipt/${planId}`).pipe(
      map((response) => {
        if (response.card && response.card.color) {
          response.card.color = BaseHttpClient.convertDecimalToRgba(response.card.color);
        }
        return response;
      }),
    );
  }
}
