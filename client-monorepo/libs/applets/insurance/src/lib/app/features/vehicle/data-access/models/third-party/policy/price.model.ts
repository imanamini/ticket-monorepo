import { PurchaseTicketTypeEnum } from '../../../enums/purchase-ticket-type.enum';

export interface Price {
  paymentMethod: PurchaseTicketTypeEnum;
  paidAt: number;
  temporaryPrice: number;
  payableAmount: number;
  totalDiscountAmount: number;
  cashAmount: number;
  creditAmount: number;
  finalPrice: number;
  priceConflictAmount: number;
  priceConflictType: number;
  providerPrice: number;
}
