import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { FEATURE_NAMES, FEATURES } from '../dpg-pay/models/features';
import { Feature, InAppTacResponse } from '../../../../api/tac/in-app-tac-response';
import { PaymentInfoResponse } from './models/payment-info.response';
import { CreditApiService } from '../../../../api/credit-api.service';
import { CreditHttpService } from '../../../../api/credit-http.service';
import { PaymentResult } from '../dpg-pay/models/payment-result.model';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { TokenService } from '../../token/token.service';

@Injectable()
export class PayClientService {

  constructor(
    private api: CreditHttpService,
    private creditApiService: CreditApiService,
    private apiConfigService: NgxApiConfigService,
    private tokenService: TokenService,
  ) {
  }

  getPaymentInfoAndInAppTac(ticket: string): Promise<{ paymentInfo: PaymentInfoResponse, inAppTac: InAppTacResponse }> {
    return this.customizeGetPayInfoAndTac(ticket, true);
  }

  getCertFile(certName: string): Observable<any> {
    return this.api.getCertFile(certName, this.creditApiService.getBearerTokenHeader(this.tokenService.token()));
  }

  payByDpg(relativePayUrl, ticket, request): Observable<PaymentResult> {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    headers = headers.append('ticket', ticket);
    headers = headers.append('Agent', this.apiConfigService.getApiConstants().agent);
    return this.api.post(relativePayUrl, request, headers);
  }

  private customizeGetPayInfoAndTac(ticket: string, withTac: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      this.creditApiService.inAppTac(ticket).subscribe(response => {
        const infoFeature = response.features[FEATURES[FEATURE_NAMES.SDK_INFO]] as Feature;
        let infoUrl = infoFeature.url;
        infoUrl = infoUrl.split('/digipay/api/')[1];

        this.getInfo(infoUrl, ticket).subscribe(infoResponse => {
          if (withTac) {
            resolve({
              paymentInfo: infoResponse,
              inAppTac: response
            });
          } else {
            resolve(infoResponse);
          }
        }, e => {
          reject(e);
        });
      });
    });
  }

  private getInfo(infoUrl: string, ticket: string): Observable<PaymentInfoResponse> {
    return this.api.get(
      infoUrl + ticket,
      undefined,
      this.creditApiService.getBearerTokenHeader(this.tokenService.token())
    );
  }
}
