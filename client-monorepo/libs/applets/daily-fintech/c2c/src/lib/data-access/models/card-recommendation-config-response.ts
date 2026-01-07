import { GenericApiResponse } from '@client-monorepo/common/network';

export interface CardRecommendationConfigResponse extends GenericApiResponse {
  banner: RecommendationBanner;
  icons: string[];
}

export interface RecommendationBanner {
  description: string;
  imageId: string;
  title: string;
}
