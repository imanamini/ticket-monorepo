export interface DiscountPlpPayload {
  pageTitle: string;
  productCategories: Array<string>;
  minDiscount: number;
  maxDiscount: number;
  storeIds?: Array<string>;
}
