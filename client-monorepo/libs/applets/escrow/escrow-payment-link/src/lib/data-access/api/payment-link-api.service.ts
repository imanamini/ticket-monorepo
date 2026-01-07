import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { PAYMENT_LINK_ENDPOINT } from './payment-link-api.endpoint';
import { PaymentLinkCreate, PaymentLinkCreateResult, PaymentLinkDetail, PaymentLinkRequestInfo } from '../model/payment-link-create.model';

@Injectable()
export class PaymentLinkApiService {
  private readonly api = inject(ApiService);

  create(model: PaymentLinkCreate): Observable<PaymentLinkCreateResult> {
    const request = new RequestBuilder(RequestTypeEnum.POST, PAYMENT_LINK_ENDPOINT.create, model);
    return this.api.call<PaymentLinkCreateResult>(request);
  }

  requestInfo(requestId: string): Observable<PaymentLinkRequestInfo> {
    const request = new RequestBuilder(RequestTypeEnum.GET, PAYMENT_LINK_ENDPOINT.requestInfo(requestId));
    return this.api.call<PaymentLinkRequestInfo>(request);
  }

  linkDetail(linkId: string): Observable<PaymentLinkDetail> {
    const request = new RequestBuilder(RequestTypeEnum.GET, PAYMENT_LINK_ENDPOINT.linkInfoById(linkId));
    return this.api.call<PaymentLinkDetail>(request);
  }
}
