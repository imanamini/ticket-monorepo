import { Coordination } from '@client-monorepo/common/location-management';
import { Store } from './store.type';

export interface BranchModel {
  address: string;
  branchId: string;
  creationDate: number;
  distance: number;
  lastModificationDate: number;
  location: Coordination;
  phoneNumber: string;
  store: Store;
  storeTrackingCode: string;
  title: string;
}
