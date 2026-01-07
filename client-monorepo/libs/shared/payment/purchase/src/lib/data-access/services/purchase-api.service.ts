import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { PurchaseResponseModel, PurchasesRequestConfigModel } from '../models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseApiService {
  apiService = inject(ApiService);

  getPurchases(config?: PurchasesRequestConfigModel): Observable<PurchaseResponseModel> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app/store/purchases');
    if (config?.from && config?.to) {
      request.setParams({ size: config.from, to: config.to });
    }
    return this.apiService.call<PurchaseResponseModel>(request);
  }
}
