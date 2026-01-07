import { InternetPackageGroup } from './internet-package-group';

export interface InternetPackageSubCategory {
  title: string;
  bundles: Array<InternetPackageGroup>;
}
