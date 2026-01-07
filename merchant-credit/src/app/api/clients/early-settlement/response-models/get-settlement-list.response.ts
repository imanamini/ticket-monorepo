import { SearchApiResponse } from '../../../models/search-api.response';
import { SettlementItem } from '../basic-models/settlement-item';

export interface GetSettlementListResponse extends SearchApiResponse {
  settlements: SettlementItem[];
}
