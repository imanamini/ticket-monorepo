import { ApiResultInterface } from '@client-monorepo/common/network';
import { Payment } from './payment';

export type TransactionApiResponse = {
  result: ApiResultInterface;
  paymentList: Array<Payment>;
};
