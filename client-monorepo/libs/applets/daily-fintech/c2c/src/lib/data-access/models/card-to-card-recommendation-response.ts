import { GenericApiResponse } from '@client-monorepo/common/network';

export interface CardToCardRecommendationResponse extends GenericApiResponse {
  recommendations: Recommendation[];
}

export interface Recommendation {
  color: number;
  id: string;
  imageId: string;
  info: Info[];
  pinned: boolean;
  subTitle: string;
  title: string;
  expired?: boolean;
}

export interface Info {
  label: string;
  value: string;
}
