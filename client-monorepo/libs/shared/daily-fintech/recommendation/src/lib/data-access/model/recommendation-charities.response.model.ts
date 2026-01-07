import { ApiResultInterface } from '@client-monorepo/common/network';

export interface RecommendationCharitiesResponseModel {
  result: ApiResultInterface;
  items: Array<RecommendationCharityResponseModel>;
}

export interface RecommendationCharityResponseModel {
  trackingCode: string;
  imageId: string;
  title: string;
  color: number;
  desc: string;
  amount: number;
  organization: string;
}
