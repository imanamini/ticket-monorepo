import { BaseApiResponse } from '../base-api.response';

export interface PaymentConfig extends BaseApiResponse {
  cardXferMax: number;
  cardXferMin: number;
  cashInDefaultValue: number;
  cashInDefaults: Array<number>;
  cashInXferMax: number;
  cashInXferMin: number;
  walletXferMax: number;
  walletXferMin: number;
}
