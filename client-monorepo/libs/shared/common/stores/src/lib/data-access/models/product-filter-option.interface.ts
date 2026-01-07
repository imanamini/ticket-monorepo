import { Restriction } from '@client-monorepo/common/network';

export interface ProductFilterOptionInterface extends Restriction<string> {
  title: ProductFilterOptionTitles;
  rangeMin?: number;
  rangeMax?: number;
}

export enum ProductFilterOptionTitles {
  PRICE = 'محدوده قیمت',
}
