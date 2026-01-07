import { ApiResultInterface } from '@client-monorepo/common/network';

export type CurrentUserPlanApiResponse = {
  result: ApiResultInterface;
  plan: UserPlan;
};

export type UserPlan = {
  title: string;
  type: number;
  durationInMonth: number;
  expirationDate: number;
  refundDetail: RefundDetail;
  services: Array<Service>;
};

type RefundDetail = {
  amount: number;
  isRefundable: boolean;
};

type Service = {
  amount: number;
  order: number;
  status: number;
  type: number;
};
