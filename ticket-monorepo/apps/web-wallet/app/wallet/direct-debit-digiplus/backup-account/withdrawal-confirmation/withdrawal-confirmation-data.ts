import { DirectDebitBank, DirectDebitTicketInfoResponse } from '../../../../api/models/direct-debit.response';

export interface WithdrawalConfirmationData {
  ticketInfo: DirectDebitTicketInfoResponse;
  ticket: string;
  bank: DirectDebitBank;
}
