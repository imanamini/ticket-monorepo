import { STORE_CATEGORIES } from './store-categories';
import { STORE_TYPES } from './store-types';

export interface SingleMerchant {
  title: string;
  subtitle: string;
  description: string;
  type: STORE_TYPES[];
  category: STORE_CATEGORIES[];
  brandId: string;
  isActive: boolean;
  website: string;
  redirectUrl: string;
  imageId: string;
  badge: MerchantBadge;
  priority: number;
  creationDate: number;
  addresses: MerchantAddress[];
  providers: number[];
}

export interface MerchantBadge {
  backgroundColor: string;
  borderColor: string;
  message: string;
  textColor: string;
  value: string;
}

export interface MerchantAddress {
  address: string;
  latitude: number;
  longitude: number;
}

export interface MerchantTypeDialog {
  title: string;
  description: string;
  steps: Array<{
    name: string;
    imagePath: string;
  }>;
}
