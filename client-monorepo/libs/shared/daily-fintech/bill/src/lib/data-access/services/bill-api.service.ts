import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { BillConfigResponse } from '../models/bill-config.response';
import { BillApiResponse } from '../models/upcoming-bill-api-response.type';
import { ActionType } from '@client-monorepo/common/action-handler';
import { RecommendedBillTypeInterface } from '@client-monorepo/common/app-services';

@Injectable({
  providedIn: 'root',
})
export class BillApiService {
  private apiService = inject(ApiService);

  getRecommendedBillConfigs(limitToShow?: number): Observable<RecommendedBillTypeInterface[]> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'bills/config');
    request = request.enableCache(1000 * 60);

    return this.apiService.call<BillConfigResponse>(request).pipe(
      map((billConfig) => {
        let filteredBills = billConfig.configs.filter((bill: any) => bill.type > 0 && bill.type !== 10);

        if (limitToShow != null) {
          filteredBills = filteredBills.slice(0, limitToShow);
        }

        return filteredBills.map((bill: any) => ({
          ...bill,
          action: {
            type: ActionType.REDIRECT,
            payload: {
              url: `/bill/identifier/${bill.type}`,
            },
          },
        }));
      }),
    );
  }

  getUpcomingBills(): Observable<BillApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'dpx/payment/upcoming/bill');
    return this.apiService.call(request);
  }
}
