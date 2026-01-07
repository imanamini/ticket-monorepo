import { VoucherDetail } from './voucher.response.interface';

export interface SeparatedVoucherInterface {
  expiredVouchers: VoucherDetail[];
  unexpiredVouchers: VoucherDetail[];
}
