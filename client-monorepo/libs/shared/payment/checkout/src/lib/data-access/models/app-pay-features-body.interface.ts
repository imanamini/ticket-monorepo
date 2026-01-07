import { TicketParams, TicketTypes } from '@client-monorepo/payment/purchase';

export interface AppPayFeaturesBody {
  type: TicketTypes;
  amount: number;
  additionalInfo: TicketParams;
  homeUrl?: string;
  payUrl?: string;
  cashInCallbackUrl?: string;
}
