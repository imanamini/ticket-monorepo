import { StorePaymentMethod } from './store.type';

export interface ProductInterface {
  documentId: string;
  hostName: string;
  title: string;
  url: string;
  price: string;
  previousPrice?: string;
  discount?: number;
  discountPercent?: number;
  mainCategory: string;
  categories?: string[];
  image: string;
  resizedImage?: string;
  storeLogoImageId?: string;
  storeRateScore?: number;
  click?: number;
  available?: boolean;
  searchCategoryName?: string;
  searchCategoryLevels?: string[];
  aiCategoryName?: string;
  aiCategoryLevels?: string[];
  storeName?: string;
  storePaymentMethods?: StorePaymentMethod[];
  externalId?: number;
}
