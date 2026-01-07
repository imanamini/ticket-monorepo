import { TOP_UP_CHARGE_TYPES } from './top-up-types';
import { TopUpPackage } from './top-up-package';

export interface TopUpPackageGroup {
  chargeType: TOP_UP_CHARGE_TYPES;
  description: string;
  subDescription: string;
  chargePackages: Array<TopUpPackage>;
  variantAvailable: boolean;
}
