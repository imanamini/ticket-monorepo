import { HttpClient } from '@angular/common/http';
import { BaseHttpClient } from '../../../../../api/base-http-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CashOutConfigModel } from '../../../../../api/digipay/models/cash-out/cash-out.model';

@Injectable({
  providedIn: 'root'
})

export class KybApiService extends BaseHttpClient {
  constructor(
    public httpClient: HttpClient
  ) {
    super(httpClient);
    this.api = 'digipay';
  }

  checkICS(body: {
    nationalCode: string,
    cellNumber: string,
    iban: string,
    birthDate: string
  }): Observable<CashOutConfigModel> {
    return super.post('merchant/credit/working-capital/ics/submit', body);
  }

  submitICS(trackingCode: string, body: {
    otp: string
  }): Observable<CashOutConfigModel> {
    return super.post(`merchant/credit/working-capital/ics/${trackingCode}/verify-otp`, body);
  }
}
