import { ApiResultInterface } from '@client-monorepo/common/network';
import { Voucher } from './voucher.model';

export interface VoucherResponseModel {
  vouchers: Voucher[];
  result: ApiResultInterface;
  totalElements: number;
  totalPages: number;
}
