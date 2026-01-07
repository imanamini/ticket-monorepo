import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InsertPlateModel } from '../../models/third-party/plate/insert-plate.model';
import { PlateModel } from '../../models/third-party/plate/plate.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';
import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class PlateApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  insertPlate(plateInfo: InsertPlateModel): Observable<UatGeneralResponse<any>> {
    return this.noInterceptorService.post(this.baseUrl + 'license', {
      body: plateInfo,
      tokenType: 'bearer',
    });
  }

  getPlates(): Observable<UatGeneralResponse<PlateModel[]>> {
    return super.get(this.baseUrl + 'license/get-licenses-by-userId');
  }
}
