import { SimType } from '../../common/sim-type';
import { InternetPackage } from '../internet-package';

export interface FavouritePackagesGroup {
  type: SimType;
  internetPackages: InternetPackage[];
}
