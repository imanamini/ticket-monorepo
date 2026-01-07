import { ActionTypeEnum } from '../emuns/direct-debit-ticket-info-action-type.enum';
import { DurationTimeUnitEnum } from '../emuns/duration-time-unit.enum';

export interface DirectDebitGenerateTicketBody {
  providerId: string;
  redirectUrl: string;
  cellNumber: string;
  maxDailyTransactionAmount?: number;
  maxDailyTransactionCount?: number;
  maxMonthlyTransactionCount?: number;
  action?: {
    type: ActionTypeEnum
  };
  duration?: {
    timeUnit: DurationTimeUnitEnum,
    count: number
  };
}


