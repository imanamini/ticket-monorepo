import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NoInterceptorService } from '../../../../../data-access/services/no-interceptor.service';
import { ApiService } from '../../../../../data-access/services/api.service';
import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService extends ApiService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected env = EnvironmentService.env;

  protected get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  baseUrl = this.environment.name === 'development' ? '../../insurance/vehicle-thirdparty/api/v1/' : 'insurance/vehicle-thirdparty/v1/';

  baseUrlV2 = this.environment.name === 'development' ? '../../insurance/vehicle-thirdparty/api/v2/' : 'insurance/vehicle-thirdparty/v2/';

  noInterceptorService = inject(NoInterceptorService);
}
