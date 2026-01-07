import { Injectable, inject } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { DeliveryRequest } from '../models/delivery.interface';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiService = inject(ApiService);

  setDeliverySetting(trackingCode: string | null, deliveryRequest: DeliveryRequest): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `escrow-channel/merchant/orders/deliver/${trackingCode}`, deliveryRequest);
    return this.apiService.call<ApiResultInterface>(request);
  }
}
