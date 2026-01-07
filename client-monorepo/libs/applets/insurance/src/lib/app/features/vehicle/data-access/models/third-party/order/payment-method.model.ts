import { PurchaseTicketTypeEnum } from '../../../enums/purchase-ticket-type.enum';
import { BnplExtraDetailModel } from './bnpl-extra-detail.model';
import { WalletExtraDetailModel } from './wallet-extra-detail.model';
import { PriceDetailModel } from './price-detail.model';

export interface PaymentMethodModel {
  id: number;
  aggregateTicketType: PurchaseTicketTypeEnum;
  title: string;
  description: string;
  isBanned: boolean;
  isSelected: boolean;
  price: PriceDetailModel;
  extraDetails: BnplExtraDetailModel | WalletExtraDetailModel;
  isVisible: boolean;
  isActive: boolean;
  priority: number;
  purchaseTicketType: PurchaseTicketTypeEnum;
}
