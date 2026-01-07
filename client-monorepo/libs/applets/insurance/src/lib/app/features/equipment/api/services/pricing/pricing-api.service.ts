import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralResponse } from '../../models/api-result.model';
import { PricingModel } from '../../models/pricing/pricing.model';
import { PricingListBodyModel } from '../../models/pricing/pricing-list-body.model';
import { ApiService } from '../../../../../data-access/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PricingApiService extends ApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
    super(httpClient);
  }

  getPricingList(body: PricingListBodyModel): Observable<GeneralResponse<PricingModel>> {
    return super.post('insurance/pricing/list', body);
  }
}
