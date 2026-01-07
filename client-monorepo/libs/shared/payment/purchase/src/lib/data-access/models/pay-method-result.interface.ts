import { UserFeature } from '@client-monorepo/common/user';

export interface PayMethodResult {
  method: PAYMENT_METHOD;
  feature: UserFeature;
}

export enum PAYMENT_METHOD {
  DPG = 'DPG',
  WALLET = 'WALLET',
  IPG = 'IPG',
}
