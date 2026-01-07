import { Injectable, inject } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { OrderFilterRequest, OrdersResponse } from '../models/order.interface';
import { Observable } from 'rxjs';
import { RefundRequest } from '../models/refund.interface';

@Injectable({
  providedIn: 'root',
})
export class SellerOrderService {
  private apiService = inject(ApiService);

  getSellerOrders(params: OrderFilterRequest): Observable<OrdersResponse> {
    const { page = 0, size = 100, ...restrictions } = params;
    const request = new RequestBuilder(
      RequestTypeEnum.POST,
      `escrow-channel/merchant/orders/search?page=${page}&size=${size}&count=true`,
      restrictions,
    );
    return this.apiService.call<OrdersResponse>(request);
  }

  confirmSellerOrder(trackingCode: string): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `escrow-channel/merchant/orders/confirm/${trackingCode}`);
    return this.apiService.call<ApiResultInterface>(request);
  }

  getRefundReasons(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'escrow-channel/refund-reasons');
    return this.apiService.call<any>(request);
  }

  cancelSellerOrder(refundRequest: RefundRequest): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'escrow-channel/merchant/refunds', refundRequest);
    return this.apiService.call<ApiResultInterface>(request);
  }
}
