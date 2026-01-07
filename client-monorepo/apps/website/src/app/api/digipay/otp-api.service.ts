import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseApiResponse } from './models/base-api.response';

@Injectable({
  providedIn: 'root',
})
export class OtpApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  sendOtpForVerification(ticket: string): Observable<BaseApiResponse> {
    return super.post(
      `users/otp`,
      {},
      {
        headers: {
          ticket,
        },
      },
    );
  }

  verifyOtpForFeature(smsToken: string, features: number[], ticket: string): Observable<any> {
    return super.post(
      'users/otp/verify',
      {
        smsToken,
        features,
      },
      {
        headers: {
          ticket,
        },
      },
    );
  }
}
