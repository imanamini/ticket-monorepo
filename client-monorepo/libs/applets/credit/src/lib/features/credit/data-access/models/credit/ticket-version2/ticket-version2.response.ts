import { GenericApiResponse } from '../../generic-api-response.model';

export enum CreditTicketTypes {
  INSTALLMENTS = 29,
}

export interface TicketVersion2Response extends GenericApiResponse {
  ticket: string;
  redirectUrl?: string;
}
