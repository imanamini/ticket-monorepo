import { InternetPackage } from './internet-package';
import { SimType } from '../common/sim-type';

export interface InternetPackageGroup {
  type: SimType;
  internetPackages: Array<InternetPackage>;
}
