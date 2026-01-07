import { ApiResultInterface } from '@client-monorepo/common/network';
import { Store, StoreBranch } from './store.type';

export type StoreSearchApiResponse = {
  results: ApiResultInterface;
  stores: Store[];
  totalElements: number;
  totalPages: number;
};

export type BranchSearchApiResponse = {
  results: ApiResultInterface;
  branches: StoreBranch[];
  totalElements: number;
  totalPages: number;
};
