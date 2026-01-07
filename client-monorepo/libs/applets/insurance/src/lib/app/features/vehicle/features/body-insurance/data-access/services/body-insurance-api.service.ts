import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../data-access/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBodyInsuranceModel } from '../models/body-insurance.model';

@Injectable({
  providedIn: 'root'
})
export class BodyInsuranceApiService extends ApiService {
  baseUrl = 'insurance/vehicle-thirdparty/v1/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getBodyInsurance(): Observable<IBodyInsuranceModel> {
    return super.get(this.baseUrl + 'white-label/redirect?productType=Body');
  }
}
