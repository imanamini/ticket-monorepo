import { ActionTypeEnum } from '../../../../api/emuns/direct-debit-ticket-info-action-type.enum';

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
  status: STATUS;
}

export type STATUS = 'SUCCESS' | 'FAILED' | 'CANCELED';
