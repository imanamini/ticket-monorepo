import { TargetPan } from './cash-out-register.model';
import {ApiResult} from "../../../api/models/api-result";

export interface CashOutConfigModel {
  result: ApiResult;
  certFile: string;
  maxAmount: number;
  minAmount: number;
  minEffectiveHours: number;
  remainingCap: number;
  tacUrl: string;
  walletBalance: number;
  feeCharge: number;
  cashoutableBalance:number
}


export interface CashOutResult {
  result: ApiResult,
  'status': string,
  'color': number,
  'imageId': string,
  'title': string
  'amount': number,
  'detailInfo': DetailInfo[],
  'trackingCode': string,
  'description': string,
}

interface DetailInfo {
  [key: string]: {
    'value': string,
    'copyable': boolean
  };
}

export interface MappedCashOutResult {
  'status': string,
  'color': number,
  'imageId': string,
  'title': string
  'amount': number,
  'paymentResult': ActivityInfo[],
  'trackingCode': string,
  'description': string,
}

export interface ActivityInfo {
  key: string;
  value: string;
  copyable: boolean;
}
