import { GenericResponse } from './generic.response';

export interface Purchase {
  providerId: string;
  purchaseCode: string;
  payResponse: object;
  business: {
    userId: string;
    name: string;
  };
  amount: number;
  trackingCode: string;
  callbackURL: string;
}

export interface TicketInfoResponse extends GenericResponse {
  purchase?: Purchase;
  walletBalance: number;
  shouldCashIn: boolean;
  images: Array<string>;
  // cash-in info
  redirectUrl?: string;
  amount?: number;
  certFile?: string;
  pspCode?: string;
}

export interface SubscriptionTicketInfoResponse extends GenericResponse {
  templateGroupId: string;
  callbackUrl: string;
  providerId: string;
  walletBalance: number;
  user: {
    userId: string;
    cellNumber: string;
  };
  business: {
    userId: string;
    name: string;
  };
  ticketType: number;
}
