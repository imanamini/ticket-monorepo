import { Order } from '@client-monorepo/common/network';

export interface ProductSortOptionInterface extends Order {
  title: ProductSortOptionsTitles;
}

export enum ProductSortOptionsTitles {
  MOST_RELEVANT = 'مرتبط‌ترین',
  DISCOUNT = 'پرتخفیف‌ترین',
  PRICE_ASC = 'ارزان‌ترین',
  PRICE_DESC = 'گران‌ترین',
}
