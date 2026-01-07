import { BaseRecommendation } from './base-recommendation';

export interface RecommendationCellNumber extends BaseRecommendation {
  operator: number;
  colors: Array<number>;
}
