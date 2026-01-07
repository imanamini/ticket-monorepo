import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { AppServiceResponseInterface } from '../models/app-service-response.interface';
import { PersonalizedServicesResponseInterface } from '../models/personalized-services-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AppApiService {
  apiService = inject(ApiService);

  getAppServicesList(): Observable<AppServiceResponseInterface> {
    let request = new RequestBuilder(RequestTypeEnum.GET, `dpx/services/displayable`);
    request = request.enableCache(5 * 60 * 1000);
    return this.apiService.call<AppServiceResponseInterface>(request);
  }

  getPersonalizedServices(): Observable<PersonalizedServicesResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `dpx/services/personalized`);
    return this.apiService.call<PersonalizedServicesResponseInterface>(request);
  }

  storePremiumServices(serviceIds: Array<string>): Observable<any> {
    const payload = {
      servicesId: serviceIds,
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, `dpx/services/personalized/preferences`, payload);
    return this.apiService.call<ApiResultInterface>(request);
  }

  editPersonalizedServices(serviceIds: Array<string>): Observable<ApiResultInterface> {
    const payload = {
      servicesId: serviceIds,
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, `dpx/services/personalized/app-services`, payload);
    return this.apiService.call<ApiResultInterface>(request);
  }
}
