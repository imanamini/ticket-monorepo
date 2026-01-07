import { RestrictionTypes } from '@client-monorepo/common/network';

export enum BranchesRestrictionFields {
  TITLE = 'title',
  BRANCH_ID = 'branchId',
  SORT = 'sort',
  STORE_TRACKING_CODE = 'store.trackingCode',
  STORE_CATEGORIES = 'store.categories',
  KEYWORD = 'keyword',
  STORE_DISABLED = 'store.state.disabled',
}

export const BranchDefaultRestriction = {
  type: RestrictionTypes.SIMPLE,
  field: BranchesRestrictionFields.STORE_DISABLED,
  operation: 'eq',
  value: false,
};
