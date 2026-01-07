import { ExtendedPricingModel } from './extended-pricing.model';
import { DiscountModel } from './discount.model';
import { BnplExtraDetailModel } from '../third-party/order/bnpl-extra-detail.model';
import { WalletExtraDetailModel } from '../third-party/order/wallet-extra-detail.model';
import { PurchaseTicketTypeEnum } from '../../enums/purchase-ticket-type.enum';

export interface PriceOptionModel {
  ticketType: PurchaseTicketTypeEnum;
  discount: DiscountModel;
  extendedPricing: ExtendedPricingModel[];
  extraDetails: BnplExtraDetailModel | WalletExtraDetailModel | null;
  payableAmount: number;
  isBanned: boolean;
  rawAmount: number;
  totalAmount: number;
}
