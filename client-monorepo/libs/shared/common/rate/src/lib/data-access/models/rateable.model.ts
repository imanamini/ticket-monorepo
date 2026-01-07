import { ApiResultInterface } from '@client-monorepo/common/network';
import { PurchaseModel } from '@client-monorepo/payment/purchase';

export interface RateableApiResponse {
  rateableList: Rateable[];
  result: ApiResultInterface;
}

export interface Rateable {
  purchase: PurchaseModel;
  uid: string;
  visibleSince: Date;
}
