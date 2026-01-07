import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditHttpService } from '../../../../api/credit-http.service';
import { ActiveBanksResponse } from './models/active-banks-response.model';
import { BankClientResponse } from './models/bank-client.response';
import { DynamicPasswordResponse } from './models/dynamic-password.response';
import { DpgDynamicPasswordRequest } from './models/dpg-card';
import { CreditApiService } from '../../../../api/credit-api.service';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

@Injectable()
export class CardApiService {

  constructor(
    private http: CreditHttpService,
    private creditApiService: CreditApiService,
    private apiConfigService: NgxApiConfigService,
  ) {
  }

  getAllBanks(token: string): Observable<ActiveBanksResponse> {
    return this.http.get('banks', undefined, this.creditApiService.getBearerTokenHeader(token));
  }

  getBankClientConfig(token: string): Observable<BankClientResponse> {
    return this.http.get(`banks/client/6`, undefined, this.creditApiService.getBearerTokenHeader(token));
  }

  requestDynamicPassword(data: DpgDynamicPasswordRequest, ticket: string): Observable<DynamicPasswordResponse> {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    headers = headers.append('ticket', ticket);
    headers = headers.append('Agent', this.apiConfigService.getApiConstants().agent);
    return this.http.post('cards/otp', data, headers);
  }
}
