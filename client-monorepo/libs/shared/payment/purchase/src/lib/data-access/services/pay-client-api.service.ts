import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  convertToRelativeUrl,
  FEATURE_NAMES,
  FEATURES,
  PaymentInfoResponse,
  PaymentResultInterface,
  TicketParams,
  TicketTypes,
} from '@client-monorepo/payment/purchase';
import { InAppTacResponse, TacService, UserFeature } from '@client-monorepo/common/user';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';

@Injectable({
  providedIn: 'root',
})
export class PayClientApiService {
  constructor(
    private apiService: ApiService,
    private tac: TacService,
  ) {}

  private customizeGetPayInfoAndTac(ticket: string, withTac = false): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tac.inAppTac(ticket).subscribe((response) => {
        const infoFeature = response.features[FEATURES[FEATURE_NAMES.SDK_INFO]] as UserFeature;
        let infoUrl = infoFeature.url as string;
        infoUrl = infoUrl.split('/digipay/api/')[1];

        this.getInfo(infoUrl, ticket).subscribe(
          (infoResponse) => {
            if (withTac) {
              resolve({
                paymentInfo: infoResponse,
                inAppTac: response,
              });
            } else {
              resolve(infoResponse);
            }
          },
          (e) => {
            reject(e);
          },
        );
      });
    });
  }

  getPaymentInfoAndInAppTac(ticket: string): Promise<{ paymentInfo: PaymentInfoResponse; inAppTac: InAppTacResponse }> {
    return this.customizeGetPayInfoAndTac(ticket, true);
  }

  getPaymentInfo(ticket: string): Promise<PaymentInfoResponse> {
    return this.customizeGetPayInfoAndTac(ticket, false);
  }

  private getInfo(infoUrl: string, ticket: string): Observable<PaymentInfoResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, infoUrl + ticket);
    return this.apiService.call<PaymentInfoResponse>(request);
  }

  getCertFile(certName: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `certs/${certName}`);
    request.patchOptions({ responseType: 'text' });
    return this.apiService.call<any>(request);
  }

  // todo set params type
  payByDpg(relativePayUrl: string, ticket: string, params: any): Observable<PaymentResultInterface> {
    const header = { 'Content-Type': 'application/json', ticket: ticket };
    let request = new RequestBuilder(RequestTypeEnum.POST, relativePayUrl, params);
    request = request.setHeader(header);
    return this.apiService.call<PaymentResultInterface>(request);
  }

  getTicket(ticketType: TicketTypes, params: TicketParams): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `tickets?type=${ticketType}`, params);
    return this.apiService.call<any>(request);
  }

  dynamicGetTicket(payUrl: string, params: TicketParams): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, convertToRelativeUrl(payUrl), params);
    return this.apiService.call<any>(request);
  }
}
