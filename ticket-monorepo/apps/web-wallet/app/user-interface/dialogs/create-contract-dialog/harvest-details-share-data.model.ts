import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { DurationTimeUnitEnum } from '../../../api/emuns/duration-time-unit.enum';

export interface HarvestDetailsShareData {
  minWalletBalance: number;
  isValidHarvestDetailsForm: boolean;
  maxDailyTransactionAmount: number;
  action?: {
    type: ActionTypeEnum,
    minWalletBalance?: number
  };
  duration?: {
    timeUnit?: DurationTimeUnitEnum,
    count?: number
  };
}
