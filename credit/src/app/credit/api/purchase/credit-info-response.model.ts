import { ApiResponse } from '../api-response.model';
import { CreditWallet } from './credit-wallet.model';
import { Redirect } from './redirect.model';
import { TicketType } from './ticket-type.model';

export interface CreditInfoResponse extends ApiResponse {
  remainingMinutes: number;
  imageId: string;
  businessTitle: string;
  redirectUrl: string;
  creditDetails: CreditWallet[];
  cancelRedirect: Redirect;
  ticketType: TicketType;
  couponVisible?: boolean;
  amount: number; // purchase amount
}
