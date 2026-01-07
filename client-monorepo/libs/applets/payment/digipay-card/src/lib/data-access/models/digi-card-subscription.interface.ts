import { ApiResultInterface } from '@client-monorepo/common/network';
import { CategorizedListModel, SubscriptionPlan } from '@client-monorepo/common/subscription';

export interface RequiredPlanResponse {
  plans: SubscriptionPlan[];
  result: ApiResultInterface;
}

export interface UserPlanResponse {
  plan: SubscriptionPlan | null;
  result: ApiResultInterface;
}
