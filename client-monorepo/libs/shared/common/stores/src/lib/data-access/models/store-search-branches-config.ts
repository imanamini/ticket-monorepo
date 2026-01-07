import { Coordination } from '@client-monorepo/common/location-management';

export interface StoreSearchBranchesConfig {
  page?: number;
  size?: number;
  storeTrackingCode?: string;
  storeCategories?: string[];
  searchText?: string;
  polygon?: Coordination[];
  mode?: 'branch-only' | 'store-summary';
}
