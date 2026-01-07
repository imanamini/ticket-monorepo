import { BaseRecommendation } from './base-recommendation';
import { BILL_TYPES } from '../bill/bill-types.enum';

export interface BillRecommendationItem extends BaseRecommendation {
  color: number;
  info: Array<{
    label: string;
    value: string;
  }>;
  type: BILL_TYPES;
  inquiryMethod: number;
}
