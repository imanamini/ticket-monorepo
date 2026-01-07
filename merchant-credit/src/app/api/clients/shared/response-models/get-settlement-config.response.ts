import { BaseApiResponse } from '../../../models/base-api.response';

export interface GetSettlementConfigResponse extends BaseApiResponse {
  ipgUrl: string;
  minCreditAmount: number;
  maxCreditAmount: number;
  minDigiPayFeeAmount: number;
  minFundProviderFeeAmount: number;
  minFeeAmountLabel: string;
  tacUrl: string;
}
