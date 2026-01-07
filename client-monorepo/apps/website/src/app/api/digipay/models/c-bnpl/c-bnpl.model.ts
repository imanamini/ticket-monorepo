import { ApiResult } from '../api-result.model';
import { SERVICE_TYPE } from '../../../../ui/models/credit/credit-plan-group';

export interface CreditAccountsResponse {
  accounts: Array<CreditAccount>;
  result: ApiResult;
}

export interface CreditAccount {
  expirationTime: number;
  remainBalance: number;
  serviceType: SERVICE_TYPE;
}
