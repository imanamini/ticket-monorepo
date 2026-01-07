import { Injectable, inject } from '@angular/core';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { OrderFilterRequest, OrdersResponse } from '../models/order.interface';
import { RateOrderRequest, RateOrderResponse } from '../models/rate.interface';
import { ConflictOrderRequest } from '../../../../../escrow-conflict/src/lib/data-access/models/conflict.interface';

@Injectable({
  providedIn: 'root',
})
export class BuyerOrderService {
  private apiService = inject(ApiService);

  getBuyerOrders(params: OrderFilterRequest): Observable<OrdersResponse> {
    const { page = 0, size = 100, ...restrictions } = params;
    const request = new RequestBuilder(
      RequestTypeEnum.POST,
      `escrow-channel/user/orders/search?page=${page}&size=${size}&count=true`,
      restrictions,
    );
    return this.apiService.call<OrdersResponse>(request);
  }

  deliverOrder(trackingCode: string): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `escrow-channel/user/orders/deliver/${trackingCode}`);
    return this.apiService.call<any>(request);
  }

  conflictOrder(data: ConflictOrderRequest): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'escrow-channel/user/orders/conflict', data);
    return this.apiService.call<GenericApiResponse>(request);
  }

  rateOrder(orderTrackingCode: string, rateRequest: RateOrderRequest): Observable<RateOrderResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `escrow-channel/user/surveys/${orderTrackingCode}`, rateRequest);
    return this.apiService.call<RateOrderResponse>(request);
  }
}
