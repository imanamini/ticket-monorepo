import { ApiResult } from './api-result';

export interface TgsTicketResponseInterface {
  payUrl: string;
  result: ApiResult;
  ticket: string;
}
