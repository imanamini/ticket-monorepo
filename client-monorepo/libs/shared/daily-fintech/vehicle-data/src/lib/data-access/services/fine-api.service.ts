import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import {
  FineConfigResponse,
  FineIdentityCheckUser,
  FineIdentityVerifyUser,
  FinePlate,
  FinesResponse,
  GetFinePlateResponse,
  IdentityCheckResponse,
} from '../models/fine';

@Injectable({
  providedIn: 'root',
})
export class FineApiService {
  apiService = inject(ApiService);

  getConfig(): Observable<FineConfigResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.GET, 'traffic-fines/config'));
  }

  getFinePlates(vehicleType = 'CAR'): Observable<GetFinePlateResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.GET, `traffic-fines/plates?vehicleTypes=${vehicleType}`));
  }

  getFinePlateDetail(plateNo: string, vehicleType = 'CAR'): Observable<FinePlate | undefined> {
    return this.getFinePlates(vehicleType).pipe(
      map((response) => {
        return response.plates.find((plate) => plate.plateNo === plateNo);
      }),
    );
  }
  getFineReport(trackingCode: string): Observable<FinesResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.GET, `traffic-fines/inquiry/${trackingCode}`));
  }

  identityCheck(plateNo: string, user: FineIdentityCheckUser): Observable<IdentityCheckResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, `plates/${plateNo}/identity/check`, user));
  }

  identityVerify(plateNo: string, user: FineIdentityVerifyUser): Observable<IdentityCheckResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, `plates/${plateNo}/identity/verify`, user));
  }

  getFineImage(trackingCode: string, violationId: string): Observable<any> {
    return this.apiService.call(
      new RequestBuilder(RequestTypeEnum.GET, `traffic-fines/inquiry/${trackingCode}/violations/${violationId}/image`),
    );
  }
}
