import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarModelItemModel } from '../../models/third-party/constant-all/car-model-item.model';
import { ConstantAllModel } from '../../models/third-party/constant-all/constant-all.model';
import { CarBrandModel } from '../../models/third-party/constant-all/car-brand.model';
import { ListItemModel } from '../../models/third-party/list-item.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ConstantsApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getConstantAll(): Observable<UatGeneralResponse<ConstantAllModel>> {
    return super.get(this.baseUrl + 'constants/all');
  }

  getBrands(carTypeId: number): Observable<UatGeneralResponse<CarBrandModel[]>> {
    return super.get(this.baseUrl + 'constants/brands?carTypeId=' + carTypeId);
  }

  getModels(carBrandId: number): Observable<UatGeneralResponse<CarModelItemModel[]>> {
    return super.get(this.baseUrl + 'constants/models?carBrandId=' + carBrandId);
  }

  getProvinces(): Observable<UatGeneralResponse<ListItemModel[]>> {
    return super.get(this.baseUrl + 'constants/provinces');
  }

  getCities(provinceId: number): Observable<UatGeneralResponse<ListItemModel[]>> {
    return super.get(this.baseUrl + 'constants/cities/' + provinceId);
  }
}
