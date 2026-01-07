import { BaseApiResponse } from '../../../models/base-api.response';
import { CreditAllocationDetail } from '../basic-models/credit-allocation-detail';

export interface GetSettlementPreviewResponse extends BaseApiResponse {
  creditAllocationDetail: CreditAllocationDetail;
  minFeeDifferenceLabel?: string;
  minFeeDifference?: number;
  payable: boolean;
}
