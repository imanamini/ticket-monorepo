import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CompleteOrderModel } from '../../../features/third-party/features/order/features/complete-order/complete-order.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getCompleteLater(applicationFormId: string): Observable<UatGeneralResponse<CompleteOrderModel>> {
    return super.get(`${this.baseUrl}application-forms/${applicationFormId}/complete-later`);
  }

  postCompleteLater(applicationFormId: string): Observable<UatGeneralResponse<boolean>> {
    return super.put(`${this.baseUrl}application-forms/${applicationFormId}/complete-later`);
  }

  checkCompleteJourney(applicationFormId: string): Observable<UatGeneralResponse<CompleteOrderModel>> {
    return super.get(`${this.baseUrl}application-forms/${applicationFormId}/check-complete-journey`);
  }

  checkHybrid(providerId: string): Observable<UatGeneralResponse<string>> {
    return super.get(`${this.baseUrl}application-forms/payments/${providerId}/check-hybrid`);
  }
}
