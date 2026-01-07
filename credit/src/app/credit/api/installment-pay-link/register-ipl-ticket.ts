import { ApiResponse } from '../api-response.model';

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

export interface RegisterIplTicketResponse extends ApiResponse {
  ticket: string;
  payUrl: string;
  fallbackUrl: string;
}
