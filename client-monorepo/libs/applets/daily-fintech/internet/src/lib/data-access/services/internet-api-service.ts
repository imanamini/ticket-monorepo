import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { InternetPurchaseResponse } from '../models/internet-purchase.response';
import { MobileProviderOperatorsResponse } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class InternetApiService {
  constructor(private apiService: ApiService) {}

  getOperators(): Observable<MobileProviderOperatorsResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'top-ups/operators');
    return this.apiService.call<MobileProviderOperatorsResponse>(request);
  }

  getBundles(operatorId: string, body: {}): Observable<InternetPurchaseResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `bundles/${operatorId}`, body);
    return this.apiService.call<any>(request);
  }
}
