import { ApiResultInterface } from '@client-monorepo/common/network';
import { BillInfoResponse } from './bill-info-response.model';

export interface BillValidateResponse {
  result: ApiResultInterface;
  billInfos: BillInfoResponse[];
}
