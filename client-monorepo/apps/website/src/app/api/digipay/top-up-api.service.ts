import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { TopUpOperatorsResponse } from './models/carrier/top-up-operators.response';
import { TopUpPackagesResponse } from './models/top-up/top-up-packages.response';
import { CreateTopUpRequest } from './models/top-up/create-top-up.request';
import { CreateTopUpResponse } from './models/top-up/create-top-up.response';
import { CampaignConfigResponse } from '../clients/models/templates/campaign/landing/campaign-config.response';

@Injectable({
  providedIn: 'root',
})
export class TopUpApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getTopUpOperators(): Observable<TopUpOperatorsResponse> {
    return super.get('top-ups/operators');
  }

  getTopUpPackages(operatorId: string): Observable<TopUpPackagesResponse> {
    return super.get('top-ups/info/' + operatorId);
  }

  createTopUp(requestParams: CreateTopUpRequest): Observable<CreateTopUpResponse> {
    return super.post('top-ups', requestParams);
  }

  getTopUpConfig(): Observable<CampaignConfigResponse> {
    return super.get('top-ups/config');
  }
}
