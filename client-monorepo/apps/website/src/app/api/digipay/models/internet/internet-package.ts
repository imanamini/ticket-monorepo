import { InternetPackageDurations } from './internet-package-durations';

export interface InternetPackage {
  bundleId: string;
  amount: number;
  duration: InternetPackageDurations;
  description: string;
  durationTranslation: string; // LOCAL
  imageId?: string;
  needApproval: boolean;
  approvalMessage?: string;
  index?: number; // LOCAL
}
