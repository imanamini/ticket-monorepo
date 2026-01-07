import { GenericApiResponse } from '../../generic-api-response.model';

export interface InstallmentPaymentTicketResponse extends GenericApiResponse {
  ticket: string;
}
