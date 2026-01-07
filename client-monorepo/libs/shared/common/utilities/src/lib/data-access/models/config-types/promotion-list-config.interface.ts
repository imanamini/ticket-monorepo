import { PromotionModes } from '@client-monorepo/common/promotions';

export interface PromotionListConfig {
  promotionGroupUuid: string;
  showInstallmentAmount: boolean;
  promotionMode: PromotionModes;
}
