import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable } from 'rxjs';
import { PlateResponse } from '../models/plate.response';
import { UpdatePlateRequest } from '../models/update-plate.request';
import { CreatePlateRequest } from '../models/create-plate.request';
import { CreateUpdatePlateResponse } from '../models/create-update-plate.response';

@Injectable({
  providedIn: 'root',
})
export class PlateApiService {
  apiService = inject(ApiService);

  getPlates(): Observable<PlateResponse> {
    return this.apiService.call<PlateResponse>(new RequestBuilder(RequestTypeEnum.GET, 'plates')).pipe(
      map((response) => {
        response.plates = response.plates.reverse();
        return response;
      }),
    );
  }

  updatePlate(data: UpdatePlateRequest): Observable<any> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, 'plates', data));
  }

  createPlate(data: CreatePlateRequest): Observable<CreateUpdatePlateResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.POST, 'plates', data));
  }

  deletePlate(plateNo: string): Observable<CreateUpdatePlateResponse> {
    return this.apiService.call(new RequestBuilder(RequestTypeEnum.DELETE, `plates/${plateNo}`));
  }
}
