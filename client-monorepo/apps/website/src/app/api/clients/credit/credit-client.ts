import { BaseHttpClient } from '../../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreditConfigResponse } from '../models/templates/credit/credit-config.response';

@Injectable({
  providedIn: 'root',
})
export class CreditClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getCreditPageConfig(): Observable<CreditConfigResponse> {
    return super.get(`/api/website/credit/config`);
  }
}
