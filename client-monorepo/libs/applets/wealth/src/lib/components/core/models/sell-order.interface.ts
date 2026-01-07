import { OrderStatus } from '../../../data-access/enums/order-status';

export interface ISellOrder {
  orderId?: string;
  instrumentId?: string;
  instrumentSymbol?: string;
  instrumentName?: string;
  remoteOrderId?: string;
  orderStatus?: OrderStatus;
  requiresOtp?: string;
  investmentType?: string;
}
