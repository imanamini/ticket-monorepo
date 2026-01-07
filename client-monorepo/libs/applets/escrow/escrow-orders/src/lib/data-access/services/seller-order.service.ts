import { Injectable, inject } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { OrderFilterRequest, OrdersResponse } from '../models/order.interface';
import { Observable } from 'rxjs';

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
}
