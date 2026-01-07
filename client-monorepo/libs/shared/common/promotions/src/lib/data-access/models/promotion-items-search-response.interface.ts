import { PagedApiResultInterface } from '@client-monorepo/common/network';
import { PromotionItemInterface } from './promotion-item.interface';

export interface PromotionItemsSearchResponseInterface extends PagedApiResultInterface {
  items: Array<PromotionItemInterface>;
}
