import { StoreType } from './store.type';

export interface ViolationRequestBody {
  activityTrackingCode?: string;
  description?: string;
  reasons?: string[];
  storeTrackingCode?: string;
  type: StoreType;
  uid?: string;
}
