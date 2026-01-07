import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AvailableProductsPostResponseModel } from '../../models/third-party/available-products/available-products-post-response.model';
import { AvailableProductsPostRequestModel } from '../../models/third-party/available-products/available-products-post-request.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AvailableProductsApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  postAvailableProducts(
    data: AvailableProductsPostRequestModel,
    id: string,
  ): Observable<UatGeneralResponse<AvailableProductsPostResponseModel>> {
    return super.post(this.baseUrl + 'application-forms/' + id + '/available-products', data);
  }
}
