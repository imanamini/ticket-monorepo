import { ApiResultInterface } from '@client-monorepo/common/network';
import { BillPayment } from './upcoming-bill.type';

export type BillApiResponse = {
  result: ApiResultInterface;
  paymentList: BillPayment[];
};
