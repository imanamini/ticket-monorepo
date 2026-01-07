import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetEnotePaymentConfigResponse extends GenericApiResponse {
  guaranteeAmount: number;
  payableAmount: number;
  icon: string;
  trackingCode: string;
}
