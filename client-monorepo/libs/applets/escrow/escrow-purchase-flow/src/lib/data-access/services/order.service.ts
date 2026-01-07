import { Injectable, inject } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { OrderResponse, TicketResponse } from '../models/order.interface';
import { Observable } from 'rxjs';
import { HttpContext, HttpContextToken } from '@angular/common/http';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiService = inject(ApiService);
  private storageService = inject(EscrowStorageService);

  getOrder(): Observable<OrderResponse> {
    const uuid = this.storageService.getEscrowUUID();
    const request = new RequestBuilder(RequestTypeEnum.GET, `escrow-channel/orders?uuid=${uuid}`);
    return this.apiService.call<OrderResponse>(request);
  }

  getOrderDetail(): Observable<OrderResponse> {
    const uuid = this.storageService.getEscrowUUID();
    const request = new RequestBuilder(RequestTypeEnum.GET, `escrow-channel/orders/detail?uuid=${uuid}`);
    return this.apiService.call<OrderResponse>(request);
  }

  trustedPay(amount: string): Observable<TicketResponse> {
    const BYPASS_INTERCEPTOR = new HttpContextToken(() => false);
    const trackingCode = this.storageService.getEscrowTrackingCode();
    const request = new RequestBuilder(
      RequestTypeEnum.GET,
      `escrow-channel/payments/ticket/${trackingCode}?amount=${amount}`,
      new HttpContext().set(BYPASS_INTERCEPTOR, true),
    );
    return this.apiService.call<TicketResponse>(request);
  }

  protectedPay(amount: string): Observable<TicketResponse> {
    const trackingCode = this.storageService.getEscrowTrackingCode();
    const request = new RequestBuilder(RequestTypeEnum.GET, `escrow-channel/payments/protected/ticket/${trackingCode}?amount=${amount}`);
    return this.apiService.call<TicketResponse>(request);
  }
}
