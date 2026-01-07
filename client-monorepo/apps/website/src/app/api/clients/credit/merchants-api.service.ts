import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseHttpClient } from '../../base-http-client';
import { CreditMerchants } from '../models/templates/credit-v3/credit-config.response';
import { PreRegisterRequest } from './pre-register.request';
import { GenericApiResponse } from '../../digipay/models/generic-api-response.model';
import { MerchantsApiModel } from '../../digipay/models/merchants/merchants-api.model';

export enum VOLUNTEER_STATES {
  ON_BOARDING = 0,
  ON_BOARDED = 1,
  PREREGISTERING = 2,
  PREREGISTERED = 3,
  REGISTERED = 4,
  REGISTRATION_FAILED = 5,
  DUPLICATE_CELL_NUMBER = 6,
  DUPLICATE_NATIONAL_ID = 7,
}

export interface PreRegisterResponse extends GenericApiResponse {
  url: string;
  state: VOLUNTEER_STATES;
  fundProviderCode: number;
  creditId: string;
  cellNumber: string;
}

export interface PreRegisterErrorResponse extends GenericApiResponse {
  messages?: Array<{
    text: string;
    fieldName: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class MerchantsApiService extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getCreditMerchants(): Observable<{
    merchants: CreditMerchants;
  }> {
    return super.get(`/api/website/credit/merchants`);
  }

  getAllMerchants(): Observable<MerchantsApiModel> {
    return super.get('api/website/merchants');
  }

  registerCreditJourney(request: PreRegisterRequest): Observable<any> {
    return super.post('/api/working-capital/merchant/register-credit', request);
  }

  checkMerchantWorkingCapital(nationalId: string): Observable<any> {
    return super.post(`/api/working-capital/check-merchant`, { nationalId });
  }
}
