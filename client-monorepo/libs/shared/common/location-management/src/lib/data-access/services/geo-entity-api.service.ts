import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { GetGeoEntitiesResponse } from '../models/get-geo-entities.response';

@Injectable({
  providedIn: 'root',
})
export class GeoEntityApiService {
  apiService = inject(ApiService);

  getGeoEntities(latitude = 0, longitude = 0): Observable<GetGeoEntitiesResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `/app/dpx/spatial/contains?latitude=${latitude}&longitude=${longitude}`);
    return this.apiService.call<GetGeoEntitiesResponse>(request);
  }
}
