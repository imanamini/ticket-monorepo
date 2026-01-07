import { InternetPackageSubCategory } from './internet-package-sub-category';

export interface InternetPackageCategory {
  title: string;
  bundleSections: Array<InternetPackageSubCategory>;
}
