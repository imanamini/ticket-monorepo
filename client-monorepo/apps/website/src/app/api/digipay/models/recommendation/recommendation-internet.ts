import { OperatorIds } from '../carrier/operator-ids';

export interface RecommendationInternet {
  id: string;
  imageId: string;
  operator: OperatorIds;
  pinned: boolean;
  title: string;
}
