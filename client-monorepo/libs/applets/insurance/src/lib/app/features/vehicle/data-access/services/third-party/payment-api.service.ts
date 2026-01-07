import { inject, Injectable } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VehiclePaymentResultModel } from '../../models/third-party/payment/vehicle-payment-result.model';
import { PaymentRequestResultModel } from '../../models/third-party/order/payment-request-result.model';
import { PaymentMethodPostModel } from '../../models/third-party/order/payment-method-post.model';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';
import { PurchaseTicketTypeEnum } from '../../enums/purchase-ticket-type.enum';
import { PaymentRequestTypeEnum } from '../../enums/payment-request-type.enum';
import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class PaymentApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  private ngxHybridServiceService = inject(NgxHybridServiceService);
  private referrerService = inject(ReferrerService);

  postPaymentMethod(data: PaymentMethodPostModel): Observable<UatGeneralResponse<null>> {
    return super.post(this.baseUrl + 'order/payment-method', data);
  }

  getPaymentResult(providerId: string): Observable<UatGeneralResponse<VehiclePaymentResultModel>> {
    return super.get(`${this.baseUrl}application-forms/payments/${providerId}/result`);
  }

  paymentRequest(
    applicationFormId: string,
    paymentRequestType: PaymentRequestTypeEnum,
    ticketType?: PurchaseTicketTypeEnum,
  ): Observable<UatGeneralResponse<PaymentRequestResultModel>> {
    return super.post(`${this.baseUrl}application-forms/${applicationFormId}/payments/request`, {
      isHybrid: this.ngxHybridServiceService.isHybrid(),
      origin: window.location.host,
      referrer: this.referrerService.referrer,
      ticketType,
      paymentRequestType,
    });
  }
}
