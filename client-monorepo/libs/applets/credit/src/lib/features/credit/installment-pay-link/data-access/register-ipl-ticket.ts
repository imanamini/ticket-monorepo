import { GenericApiResponse } from '../../data-access/models/generic-api-response.model';

export interface RegisterIplTicketDetail {
  trackingCode: string;
  count: number;
  amount: number;
  clear: boolean;
}

export interface RegisterIplTicketBody {
  callbackUrl: string;
  ticketRequestDetails?: RegisterIplTicketDetail[];
}

export interface RegisterIplTicketResponse extends GenericApiResponse {
  ticket: string;
  payUrl: string;
  fallbackUrl: string;
}
