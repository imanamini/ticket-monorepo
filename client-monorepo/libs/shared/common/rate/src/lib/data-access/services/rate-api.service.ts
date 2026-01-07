import { inject, Injectable } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { RateBody } from '../models/rate-body.model';
import { RateableApiResponse } from '../models/rateable.model';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class RateApiService {
  apiService = inject(ApiService);
  storageService = inject(StorageService);
  baseUrl = 'app/store/rate';

  public getAllRatables(): Observable<RateableApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, this.baseUrl + `/rateable`);
    return this.apiService.call<RateableApiResponse>(request);
  }

  public postRate(body: RateBody): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseUrl, body);
    return this.apiService.call<ApiResultInterface>(request);
  }

  public postpone(uid: string, reasons: string[]): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseUrl + `/postpone`, { uid, reasons });
    return this.apiService.call<ApiResultInterface>(request);
  }

  public ignore(uid: string, reasons: string[]): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseUrl + `/ignore`, { uid, reasons });
    return this.apiService.call<ApiResultInterface>(request);
  }
}
