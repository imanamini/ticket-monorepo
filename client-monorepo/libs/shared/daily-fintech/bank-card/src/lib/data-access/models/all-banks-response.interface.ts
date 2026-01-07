import { ApiResultInterface } from '@client-monorepo/common/network';
import { Bank } from '@client-monorepo/daily-fintech/bank-card';

export interface AllBanksResponseInterface extends ApiResultInterface {
  banks: Array<Bank>;
  maxTimeout: number;
}
