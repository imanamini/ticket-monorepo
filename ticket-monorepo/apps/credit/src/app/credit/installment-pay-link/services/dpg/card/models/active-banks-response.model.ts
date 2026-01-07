import { Bank } from './bank.model';
import { ApiResult } from '../../../../../shared/models/api-result.model';

export interface ActiveBanksResponse {
  result: ApiResult;
  banks: Array<Bank>;
  maxTimeout: number;
}
