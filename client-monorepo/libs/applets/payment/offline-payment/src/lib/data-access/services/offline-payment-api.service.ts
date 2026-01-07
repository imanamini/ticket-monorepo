import { Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { InvoicePaymentResponse } from '../models/invoice-payment.response';
import { MerchantDetailResponse } from '../models/merchant-detail.response';
import { OldOfflinePaymentResponse } from '../models/old-offline-payment-response.model';

@Injectable({
  providedIn: 'root',
})
export class OfflinePaymentApiService {
  constructor(private apiService: ApiService) {}

  getInvoiceDetail(invoiceNumber: string): Observable<InvoicePaymentResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `payment/marketplace/invoices/uniqueNumber/${invoiceNumber}`);
    return this.apiService.call<InvoicePaymentResponse>(request);
  }

  getMerchantDetail(merchantUniqueId: string): Observable<MerchantDetailResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `payment/marketplace/merchants/${merchantUniqueId}`);
    return this.apiService.call<MerchantDetailResponse>(request);
  }

  getOldInvoiceDetail(trackingCode: string): Observable<OldOfflinePaymentResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `marketplace/purchases/${trackingCode}`);
    return this.apiService.call<OldOfflinePaymentResponse>(request);
  }
}
