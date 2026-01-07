import { ApiResultInterface } from '@client-monorepo/common/network';

export interface CardPaymentConfigResponse extends ApiResultInterface {
  minAmount: number;
  maxAmount: number;
  trace?: string;
}
