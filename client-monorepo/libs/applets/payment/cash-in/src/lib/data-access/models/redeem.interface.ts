import { ApiResultInterface } from '@client-monorepo/common/network';

export interface RedeemResponseInterface {
  result: ApiResultInterface;
  serial: string;
  trackingCode: string;
}
