import { TopUpPackageGroup } from './top-up-package-group';

export interface TopUpPackagesResponse {
  topUpInfos: Array<TopUpPackageGroup>;
  defaultChargePackage: number;
  maxAmount: number;
  minAmount: number;
  amountFactor: number;
}
