import { InAppTacResponse } from './models/tac/in-app-tac.response';
import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaymentInfo } from './models/payment/payment-info';
import { PaymentResult } from './models/payment/payment-result';

@Injectable({
  providedIn: 'root',
})
export class TacApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getInfoByUrl(url: string, ticket): Observable<PaymentInfo> {
    const headers = new HttpHeaders().set('ticket', ticket);
    if (url.split('').pop() !== '/') {
      url = url + '/';
    }
    return super.get(url + ticket, null, headers);
  }

  getPaymentInfo(ticket: string): Observable<PaymentInfo> {
    // @ts-ignore
    return this.getTac(ticket);
  }

  getTac(ticket: string): Observable<InAppTacResponse> {
    // @ts-ignore
    return super
      .post(
        `users/in-app/tac`,
        {},
        {
          headers: {
            ticket,
          },
        },
      )
      .pipe(
        map((response) => {
          if (response.features) {
            Object.keys(response.features).forEach((key) => {
              const f = response.features[key];
              if (f.url) {
                // remove the last dash character
                // make URLs standard
                if (f.url.slice(-1) === '/') {
                  f.url = f.url.substr(0, f.url.length - 1);
                }
              } else {
                f.url = '';
              }

              const apiPrefix = '/digipay/api/';
              const position = f.url.indexOf(apiPrefix);
              f.relativeUrl = f.url.substr(position + apiPrefix.length);

              response.features[key] = f;
            });
          }

          return response;
        }),
      );
  }

  getCertFile(certName: string): Observable<string> {
    return super.getCertFile(certName);
  }

  payByDpg(relativePayUrl, ticket, request): Observable<PaymentResult> {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    headers = headers.append('ticket', ticket);
    return super.post(relativePayUrl, request, headers);
  }
}
