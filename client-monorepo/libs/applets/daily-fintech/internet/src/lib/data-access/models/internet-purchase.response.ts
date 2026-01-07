import { ApiResultInterface } from '@client-monorepo/common/network';

export interface InternetPurchaseResponse {
  result: ApiResultInterface;
  bundleCategories: BundleCategory[];
}

export interface BundleCategory {
  title: string;
  bundleSections: BundleSection[];
}

export interface BundleSection {
  title: string;
  bundles: Bundle[];
}

export interface Bundle {
  type: number;
  internetPackages: InternetPackage[];
}

export interface InternetPackage {
  bundleId: string;
  amount: number;
  duration: number;
  description: string;
  imageId?: string;
  needApproval?: boolean;
  approvalMessage?: string;
}
