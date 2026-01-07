import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { BillConfigResponse } from '../models/bill-config.response';
import { BillMobileResponseModel } from '../models/bill-mobile-response.model';
import { BillValidateResponse } from '../models/bill-validate-response.model';

@Injectable({
  providedIn: 'root',
})
export class BillApiService {
  private apiService = inject(ApiService);

  getBillConfig(): Observable<BillConfigResponse> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'bills/config');
    request = request.enableCache(1000 * 60);
    return this.apiService.call<BillConfigResponse>(request);
  }

  validateBill(param: object): Observable<BillValidateResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'bills/validate', param);
    return this.apiService.call(request);
  }

  getCellNumberInquiry(cellNumber: string, operator: number): Observable<BillMobileResponseModel> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `bills/inquiry/${cellNumber}?operator=${operator}`);
    return this.apiService.call(request);
  }
}
