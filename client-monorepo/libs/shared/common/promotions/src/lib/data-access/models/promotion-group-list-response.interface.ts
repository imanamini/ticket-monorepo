import { ApiResultInterface } from '@client-monorepo/common/network';
import { PromotionGroupInterface } from '@client-monorepo/common/promotions';

export interface PromotionGroupListResponseInterface extends ApiResultInterface {
  groups: Array<PromotionGroupInterface>;
}
