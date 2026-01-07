import { ChargePackage, TopUpInfo } from './topup-Info.model';

export interface TopUpTypePickerResult {
  selectedAmount: ChargePackage;
  isFascinating: boolean;
  packages: Array<TopUpInfo>;
  title: string;
  chargeType: number;
}
