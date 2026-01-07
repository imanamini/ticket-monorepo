import { SeparatedVoucherInterface } from '../models/separated-voucher.interface';
import { VoucherDetail } from '../models/voucher.response.interface';

export function separateVouchers(voucherDetails: VoucherDetail[]): SeparatedVoucherInterface {
  const expiredVouchers = voucherDetails.filter((voucherDetail) => voucherDetail.expired);
  const unexpiredVouchers = voucherDetails.filter((voucherDetail) => !voucherDetail.expired);
  return { expiredVouchers, unexpiredVouchers };
}
