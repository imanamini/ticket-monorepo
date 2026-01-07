import { BaseRecommendation } from './base-recommendation';
import { CellNumberType } from './cell-number-type.model';

export interface RecommendationData extends BaseRecommendation {
  operator: number;
  colors: Array<number>;
  cellNumberType: CellNumberType;
  organization: string;
  type: number;
  amount: number;
}
