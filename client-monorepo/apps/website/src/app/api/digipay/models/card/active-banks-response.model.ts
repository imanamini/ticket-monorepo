import { Bank } from './bank.model';
import { ApiResult } from '../api-result.model';

export interface ActiveBanksResponse {
  result: ApiResult;
  banks: Array<Bank>;
  maxTimeout: number;
}
