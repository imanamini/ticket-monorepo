import { Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { CharityConfigResponseModel } from '../models/charity-config.response.model';

@Injectable({
  providedIn: 'root',
})
export class CharityApiService {
  constructor(private apiService: ApiService) {}

  getCharityConfig(): Observable<CharityConfigResponseModel> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'donations/config');
    return this.apiService.call<CharityConfigResponseModel>(request);
  }
}
