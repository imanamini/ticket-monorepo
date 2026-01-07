import { inject, Injectable } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CheckVpnApiService {
  private apiService = inject(ApiService);

  checkVpnApiCall(): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app/dpx/vpn/check');
    return this.apiService.call(request);
  }
}
