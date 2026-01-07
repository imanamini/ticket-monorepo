import { RestrictionTypes } from '@client-monorepo/common/network';
import { StoreRestrictionFields } from '../constants/stores.const';
import { VouchersRestrictionFields } from '@client-monorepo/vouchers';

export interface StoresFiltersModel {
  id: string;
  sectionName: string;
  sectionType?: StoresFilterSectionTypes;
  filters?: StoresSingleFilterModel[];
}

export enum StoresFilterSectionTypes {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  CATEGORY_ITEM = 'CATEGORY_ITEM',
}

export interface StoresSingleFilterModel {
  id: string;
  label: string;
  icon?: string;
  isSelected: boolean;
}

export const StoreDefaultRestriction = {
  type: RestrictionTypes.SIMPLE,
  field: StoreRestrictionFields.IS_DEACTIVE,
  operation: 'eq',
  value: false,
};
export const VouchersDefaultRestriction = {
  type: RestrictionTypes.SIMPLE,
  field: VouchersRestrictionFields.STORE_DEACTIVE,
  operation: 'eq',
  value: false,
};
