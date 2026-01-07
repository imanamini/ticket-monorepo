import {CashOutRegisterModel} from "../models/cash-out-register.model";

export const REGISTER_CASH_OUT_INFO: CashOutRegisterModel = {
  amount: 0,
  type: 'card',
  targetPan: {
    expireDate: '1400/11',
    value: '0',
    type: 0
  }
};
