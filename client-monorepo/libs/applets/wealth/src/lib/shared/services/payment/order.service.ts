import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { PaymentProxyService } from './payment-proxy.service';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { IOrderRequest, IOrderResponse, ProviderKey } from '../../../components/core/models/fund-schemas';
import { ICheckoutRequest } from '../../../components/core/models/fund-schemas/fund-checkout-request.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly paymentProxy = inject(PaymentProxyService);

  submitOrder(provider: ProviderKey, req: IOrderRequest): Observable<TServiceResult<IOrderResponse>> {
    this.validateOrder(provider, req);
    return this.paymentProxy.impl(provider).order(req);
  }

  submitCheckout(provider: ProviderKey, req: ICheckoutRequest): void {
    this.validateCheckout(req);
    this.paymentProxy.impl(provider).checkout(req);
  }

  private validateOrder(provider: ProviderKey, req: IOrderRequest) {
    if (!req?.symbol) throw new Error('symbol is required');
    switch (provider) {
      case 'wallet':
      case 'treasury':
        if (req.amount == null || req.amount <= 0) {
          throw new Error('amount must be > 0');
        }
        break;
      case 'fund':
      case 'etf':
        if ((req.units == null || req.units <= 0) && (req.amount == null || req.amount <= 0)) {
          throw new Error('units or amount must be > 0');
        }
        break;
    }
  }

  private validateCheckout(req: ICheckoutRequest) {
    if (!req?.orderId) throw new Error('orderId is required');
  }
}
