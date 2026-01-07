import { BaseRecommendation } from './base-recommendation';

export interface RecommendationBill extends BaseRecommendation {
  color: number;
  info: Array<{
    label: string;
    value: string;
  }>;
  type: number;
  inquiryMethod: number;
}
