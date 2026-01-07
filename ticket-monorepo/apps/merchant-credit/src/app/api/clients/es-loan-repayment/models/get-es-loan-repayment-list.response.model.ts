import { SearchApiResponse } from '../../../models/search-api.response';
import { RepaymentItemModel } from './repayment.item.model';

export interface GetEsLoanRepaymentListResponse extends SearchApiResponse {
  settlements: RepaymentItemModel[];
}
