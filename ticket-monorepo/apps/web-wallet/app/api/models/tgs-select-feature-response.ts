import { ApiResult } from './api-result';

export interface TgsSelectFeatureResponse {
  amount: number;
  payUrl: string;
  redirectUrl: string;
  walletBalance: number;
  cashInDefaultValue?:number,
  cashInDefaults?:Array<number>,
  cashInXferMax?:number,
  cashInXferMin? :number,
  certFile?:string,
  images?:Array<string>,
  pspCode?:string,
  // Deference between walletBalance user purchase amount
  rawAmount?: number,
  cashInAmount?:number,
  result: ApiResult;
}
