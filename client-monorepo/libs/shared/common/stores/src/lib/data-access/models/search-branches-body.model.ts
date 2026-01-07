import { SearchPayloadInterface } from '@client-monorepo/common/network';

export interface SearchBranchesBodyModel {
  latitude: number;
  longitude: number;
  size?: number;
  page?: number;
  project?: string;
  mode?: 'branch-only' | 'store-summary';
  searchRequest?: SearchPayloadInterface<any>;
  keyword?: string;
}
