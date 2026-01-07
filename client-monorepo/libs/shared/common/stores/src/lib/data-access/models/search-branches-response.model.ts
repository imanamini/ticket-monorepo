import { ApiResultInterface } from '@client-monorepo/common/network';
import { BranchModel } from './branch.model';

export interface SearchBranchesResponseModel {
  branches: BranchModel[];
  result: ApiResultInterface;
  totalElements: number;
  totalPages: number;
}
