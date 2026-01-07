import { ProductSortOptionInterface, ProductSortOptionsTitles } from '../models/product-sort-option.interface';

export enum OrderTypes {
  ASC = 'asc',
  DESC = 'desc',
}

export const ProductSortOptionsConst: ProductSortOptionInterface[] = [
  {
    title: ProductSortOptionsTitles.MOST_RELEVANT,
    field: '',
    order: OrderTypes.DESC,
  },
  {
    title: ProductSortOptionsTitles.DISCOUNT,
    field: 'discountPercent',
    order: OrderTypes.DESC,
  },
  {
    title: ProductSortOptionsTitles.PRICE_ASC,
    field: 'price',
    order: OrderTypes.ASC,
  },
  {
    title: ProductSortOptionsTitles.PRICE_DESC,
    field: 'price',
    order: OrderTypes.DESC,
  },
];
