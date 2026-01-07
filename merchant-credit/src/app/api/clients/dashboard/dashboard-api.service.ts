import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpClient } from '../base-http-client';
import { GetMerchantsResponse } from '../../../modules/dashboard/sandbox/models/merchants.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardApiService extends BaseHttpClient {

  getMerchants(): Observable<GetMerchantsResponse> {
    return super.get('credit/merchants');
  }
}
