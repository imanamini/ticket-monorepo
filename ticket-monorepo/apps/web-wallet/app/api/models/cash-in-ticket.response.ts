import { GenericResponse } from './generic.response';

export interface CashInTicketResponse extends GenericResponse {
  ticket: string;
  payUrl: string;
  fallbackUrl: string;
}
