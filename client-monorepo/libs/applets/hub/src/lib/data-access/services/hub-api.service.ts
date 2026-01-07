import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { CharityApiResponse } from '../models/charity-api-response.type';

@Injectable({
  providedIn: 'root',
})
export class HubApiService {
  apiService = inject(ApiService);

  getCharities(): Observable<CharityApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'donations/config');
    return this.apiService.call(request);
  }
}
