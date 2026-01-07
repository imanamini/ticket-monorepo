import { SaleChannelEnum } from '../../../shared-steps/models/sales-channel.enum';

export interface DiscountCampaignModel {
  id: string;
  title: string;
  discountId: string;
  discountCode: string;
  saleChannel: SaleChannelEnum;
}
