import { InternetPackageCategory } from './internet-package-category';
import { BaseApiResponse } from '../base-api.response';

export interface InternetPackagesResponse extends BaseApiResponse {
  bundleCategories: Array<InternetPackageCategory>;
}
