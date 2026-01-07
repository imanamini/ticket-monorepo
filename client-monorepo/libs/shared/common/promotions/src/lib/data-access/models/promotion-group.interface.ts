import { PromotionGroupTypeEnum } from './promotion-group-type.enum';
import { PromotionItemInterface } from './promotion-item.interface';
import { PromotionGroupProductStatsInterface } from './promotion-group-product-stats.interface';

export interface PromotionGroupInterface {
  uuid: string;
  title: string;
  type: PromotionGroupTypeEnum;
  periodTime?: number;
  items?: Array<PromotionItemInterface>;
  productsStat?: PromotionGroupProductStatsInterface;
}
