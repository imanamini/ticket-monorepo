import { BaseApiResponse } from '../../../models/base-api.response';
import { EarlySettlementRule } from '../basic-models/early-settlement-rules';

export interface GetSettlementRulesResponse extends BaseApiResponse {
  ruleDetails: EarlySettlementRule[];
}
