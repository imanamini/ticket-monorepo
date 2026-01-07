import { ApiResultInterface } from '@client-monorepo/common/network';
import { BillInfoResponse } from './bill-info-response.model';

export interface BillMobileResponseModel {
  result: ApiResultInterface;
  midTerm: BillInfoResponse;
  finalTerm: BillInfoResponse;
}
