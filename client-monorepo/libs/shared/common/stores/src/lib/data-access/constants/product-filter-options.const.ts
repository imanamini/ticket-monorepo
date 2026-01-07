import { ProductFilterOptionInterface, ProductFilterOptionTitles } from '../models/product-filter-option.interface';

export enum RestrictionTypes {
  SIMPLE = 'simple',
  COLLECTION = 'collection',
  RANGE = 'range',
  AND = 'and',
  OR = 'or',
}
export const ProductFilterOptionsConst: ProductFilterOptionInterface[] = [
  {
    title: ProductFilterOptionTitles.PRICE,
    type: RestrictionTypes.RANGE,
    field: 'price',
    minValue: 1000,
    maxValue: 100000000000,
    rangeMin: 1000,
    rangeMax: 100000000000,
  },
];
