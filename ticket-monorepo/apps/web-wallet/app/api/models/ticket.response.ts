import { GenericResponse } from './generic.response';

export interface TicketResponse extends GenericResponse {
  payUrl: string;
  ticket: string;
  userId: string;
}
