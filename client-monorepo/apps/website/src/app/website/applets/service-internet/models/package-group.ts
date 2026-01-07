import { InternetPackage } from '../../../../api/digipay/models/internet';

export interface PackageGroup {
  title: string;
  packages: InternetPackage[];
}
