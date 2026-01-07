import { GenericApiResponse } from '../../../generic-api-response.model';

export interface InstallmentSaleCartReservationResponse extends GenericApiResponse {
  longTermDueDate: number;
}
