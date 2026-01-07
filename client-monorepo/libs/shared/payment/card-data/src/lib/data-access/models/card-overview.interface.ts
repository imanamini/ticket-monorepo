import { AccountStatus } from '@client-monorepo/common/user-assets';

export interface CardOverview {
  logoImageId?: string;
  imageId?: string;
  alias?: Alias;
  mainValue: Alias;
  color: string[];
  leftLabel?: Alias;
  rightLabel?: Alias;
  featureName?: string;
  activationStatus?: number;
  currentStep?: number;
  serviceType?: number;
  installmentCount?: number;
  accountStatus?: AccountStatus;
}

export interface Alias {
  value: string;
  textColor?: string;
  backgroundColor?: string;
  imageId?: any;
}
