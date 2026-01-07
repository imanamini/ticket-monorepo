import { STORE_PROVIDERS, STORE_PROVIDERS_TRANSLATION } from '../../../../../../api/digipay/models/merchants/store-providers';
import {
  STORE_TYPES,
  STORE_TYPES_LINK_TRANSLATION,
  STORE_TYPES_LONG_TRANSLATION,
} from '../../../../../../api/digipay/models/merchants/store-types';
import { STORE_CATEGORIES, STORE_CATEGORIES_TRANSLATION } from '../../../../../../api/digipay/models/merchants/store-categories';

export enum SortMerchants {
  MOST_POPULAR,
  NEWEST,
  OLDEST,
  ALPHABETIC,
}

export interface SingleFilter<OptionsType> {
  title: string;
  filterOptions: OptionsType;
}

export interface FilterOptions {
  [key: string]: Array<string>;
}

export const FILTER_TITLE_TRANSLATOR = {
  providers: 'نوع اعتبار:',
  type: 'نحوه خرید:',
  category: 'نوع فروشگاه:',
  brand: 'نام فروشگاه:',
};

export const SELECT_FILTER_TRANSLATOR = {
  providers: STORE_PROVIDERS_TRANSLATION,
  type: STORE_TYPES_LONG_TRANSLATION,
  typeLink: STORE_TYPES_LINK_TRANSLATION,
  category: STORE_CATEGORIES_TRANSLATION,
};

export type MultipleCheckboxOptionsTypes = typeof STORE_TYPES | typeof STORE_PROVIDERS | typeof STORE_CATEGORIES;

export interface BrandFilter {
  title: string;
  brandId: string;
  imagePath: string;
}
