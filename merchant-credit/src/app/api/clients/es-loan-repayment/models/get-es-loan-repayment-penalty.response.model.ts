import { SearchApiResponse } from '../../../models/search-api.response';

export interface GetEsLoanRepaymentPenaltyResponse extends SearchApiResponse {
  repaymentPenaltyAmount: number;
}
