import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RequestQueryInsuranceCardItemModel } from '../../models/third-party/plp/request-query-insurance-plp.model';
import { ResponseInitialQueryInsuranceCardItemModel } from '../../models/third-party/plp/response-query-insurance-plp.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class QueryApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  postInitialQueryInsuranceCardItems(
    body: RequestQueryInsuranceCardItemModel,
    sessionId?: string,
  ): Observable<UatGeneralResponse<ResponseInitialQueryInsuranceCardItemModel>> {
    return super.post(`${this.baseUrl}price/initial-query${sessionId ? '?sessionId=' + sessionId : ''}`, sessionId ? {} : body);
  }
}
