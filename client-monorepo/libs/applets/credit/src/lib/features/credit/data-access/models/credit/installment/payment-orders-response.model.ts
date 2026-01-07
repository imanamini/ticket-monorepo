import { GenericApiResponse } from '../../generic-api-response.model';
import { PaymentOrderDetail } from './payment-order-detail.model';

export interface PaymentOrdersResponse extends GenericApiResponse {
  count: number;
  payable: boolean;
  currentDate: number;
  startDate: number;
  paymentOrders: Array<PaymentOrderDetail>;
  pinnedPaymentOrders: Array<PaymentOrderDetail>;
}
