import { StoreRestrictionFields } from '@client-monorepo/stores';

export interface FilterChipsModel {
  order: number;
  label: string;
  clickDisabled: boolean;
  value: any;
  routeKey: StoreRestrictionFields;
  pressed: boolean;
  type: 'DELETABLE' | 'EXPANDABLE' | 'QUICK_FILTER' | 'NONE';
}
