import { ApiResultInterface } from '@client-monorepo/common/network';
import { TopUpInfo } from './topup-Info.model';

export interface TopUpPackageResponse {
  result: ApiResultInterface;
  amountFactor: number;
  defaultChargePackage: number;
  maxAmount: number;
  minAmount: number;
  topUpInfos: TopUpInfo[];
}
