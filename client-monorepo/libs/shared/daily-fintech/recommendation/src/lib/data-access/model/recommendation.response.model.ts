import { RecommendationData } from './recommendation-data.model';
import { RecommendationBill } from './recommendation-bill.model';
import { ApiResultInterface } from '@client-monorepo/common/network';

export interface RecommendationResponse {
  result: ApiResultInterface;
  recommendations: Array<RecommendationData | RecommendationBill | any>;
}
