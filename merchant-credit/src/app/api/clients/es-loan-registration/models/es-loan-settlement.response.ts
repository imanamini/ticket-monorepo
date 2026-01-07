import { BaseApiResponse } from '../../../models/base-api.response';

export interface GetEsLoanSettlementResponse extends BaseApiResponse {
  trackingCode: string;
  ticket: string;
}
