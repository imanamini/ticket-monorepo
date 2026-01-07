import { ApiResultInterface } from '@client-monorepo/common/network';

export interface DirectDebitAutoCashIn {
  cashInAmount: number;
  minimumBalance: number;
  active?: boolean;
}

export interface DirectDebitAutoCashInResponse extends DirectDebitAutoCashIn {
  result: ApiResultInterface;
}
