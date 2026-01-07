import { GenericResponse } from './generic.response';

export interface PaymentConfig extends GenericResponse {
  cashInDefaultValue?: number;
  cashInDefaults?: Array<number>;
  cashInXferMax?: number;
  cashInXferMin?: number;
  walletXferMax?: number;
  walletXferMin?: number;
  // For cash-in applet
  maxAmount?: number;
  minAmount?: number;
  defaultAmountValue?: number;
  defaultAmounts?: Array<number>;
}
