import { ProductInterface } from './product.interface';
import { Store } from './store.type';

export interface RecentlyViewedProduct extends ProductInterface {
  viewedAt: number; // timestamp
}

export interface RecentlyViewedStore extends Store {
  viewedAt: number; // timestamp
}

export interface RecentlyViewedData {
  products: RecentlyViewedProduct[];
  stores: RecentlyViewedStore[];
}
