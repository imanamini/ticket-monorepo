import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { TopUpPackageResponse } from '@client-monorepo/applets/top-up';
import { MobileProviderOperatorsResponse } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class TopUpApiService {
  constructor(private apiService: ApiService) {}

  getOperators(): Observable<MobileProviderOperatorsResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'top-ups/operators');
    return this.apiService.call<MobileProviderOperatorsResponse>(request);
  }

  getTopUpPackage(operatorId: string, type: number): Observable<TopUpPackageResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `top-ups/info/${operatorId}?type=${type}`);
    return this.apiService.call<TopUpPackageResponse>(request);
  }
}
