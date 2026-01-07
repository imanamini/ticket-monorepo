import { ActionTypeEnum } from '../../../api/emuns/direct-debit-ticket-info-action-type.enum';
import { DirectDebitPlusResultDataStatusType } from './direct-debit-plus-result-data-status.type';

export interface DirectDebitResultDataInterface {
  contractId: string;
  result: {
    status: number;
    message: string;
  };
  ticket: string;
  action: {
    type: ActionTypeEnum
  };
  status: DirectDebitPlusResultDataStatusType;
}

