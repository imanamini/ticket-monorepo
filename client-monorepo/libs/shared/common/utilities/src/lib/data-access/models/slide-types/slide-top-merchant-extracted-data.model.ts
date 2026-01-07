import { ProductInterface, Store } from '@client-monorepo/stores';

export interface SlideTopMerchantExtractedData {
  store: Store;
  products: ProductInterface[];
  badge: 'MOST_DISCOUNTED' | 'BEST_SELLER' | 'NEW';
  image?: string;
  altText?: string;
}

