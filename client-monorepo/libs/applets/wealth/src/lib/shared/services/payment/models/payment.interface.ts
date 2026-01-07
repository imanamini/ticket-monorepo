import { Observable } from 'rxjs';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { IOrderRequest, IOrderResponse, ProviderKey } from '../../../../components/core/models/fund-schemas';
import { ICheckoutRequest } from '../../../../components/core/models/fund-schemas/fund-checkout-request.interface';

export interface IPaymentProxy {
  impl(key: ProviderKey): Payment;
}

export interface Payment {
  order(data: IOrderRequest): Observable<TServiceResult<IOrderResponse>>;
  checkout(data: ICheckoutRequest): void;
}
