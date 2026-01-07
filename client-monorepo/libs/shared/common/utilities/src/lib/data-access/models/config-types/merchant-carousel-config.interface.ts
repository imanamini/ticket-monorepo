import { StoreCategoryTitle, StoreType } from '@client-monorepo/stores';

export interface MerchantCarouselConfig {
  title: string;
  category: StoreCategoryTitle;
  storeType: StoreType;
  searchKeyword: string;
}
