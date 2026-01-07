import { ApiResultInterface } from '@client-monorepo/common/network';

export type CharityConfigResponseModel = {
  results: ApiResultInterface;
  organizations: Organization[];
};

export type Organization = {
  businessId: string;
  colors: number[];
  defaultAmount: number;
  description: string;
  imageId: string;
  maxAmount: number;
  minAmount: number;
  name: string;
  placement: number;
  recommendations: number[];
  supportedTypes: number[];
};
