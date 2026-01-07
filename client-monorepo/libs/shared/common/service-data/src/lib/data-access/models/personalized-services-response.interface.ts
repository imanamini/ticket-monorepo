import { ApiResultInterface } from '@client-monorepo/common/network';

export interface PersonalizedServicesResponseInterface {
  result: ApiResultInterface;
  servicesId: string[];
  userPreferences: number[];
  needOnBoarding: boolean;
}
