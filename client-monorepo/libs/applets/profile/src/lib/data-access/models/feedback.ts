import { ApiResultInterface } from '@client-monorepo/common/network';

export type FeedbackApiResponse = {
  result: ApiResultInterface;
  categories: Array<FeedbackCategory>;
};

export type FeedbackCategory = {
  id: number;
  name: string;
  description: string;
  subCategories: {
    id: number;
    name: string;
    description: string;
  };
};
