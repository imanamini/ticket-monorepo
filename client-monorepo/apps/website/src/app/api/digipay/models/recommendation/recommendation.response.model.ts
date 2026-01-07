import { RecommendationCellNumber } from './recommendation-cell-number.model';
import { BillRecommendationItem } from './recommendation-bill.model';
import { BaseApiResponse } from '../base-api.response';
import { RecommendationInternet } from './recommendation-internet';

export interface RecommendationResponse extends BaseApiResponse {
  recommendations: Array<RecommendationCellNumber | BillRecommendationItem | RecommendationInternet | any>;
}
