import { ChargePackage, TopUpInfo } from './topup-Info.model';
import { TopUpTypePickerResult } from './top-up-type-picker-result.model';
import { MobileOperator } from '@client-monorepo/common/utilities';

export interface TopUpPurchaseState {
  amount: ChargePackage;
  cellNumber: string;
  isFascinating: boolean;
  operatorCode: string; // RIGHTEL, MTN, MCI
  operatorId: string; // 1, 2, 3
  operatorName: string; // persian
  packages: Array<TopUpInfo>;
  typePickerResult: TopUpTypePickerResult;
  simType: string;
  operator?: MobileOperator;
}
