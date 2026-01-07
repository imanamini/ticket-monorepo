import { Action } from '@client-monorepo/common/action-handler';

export interface RecommendedBillTypeInterface {
  title: string;
  imageId: string;
  type: number;
  action: Action;
}
