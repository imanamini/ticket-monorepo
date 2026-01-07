import { AppServiceCategoryInterface } from './app-service-category.interface';
import { ServiceTypeEnum } from './service-type.enum';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { AppServiceBadge } from './app-service-badge.interface';
import { AppServiceStatusEnum } from './app-service-status.enum';

export interface AppServiceInterface {
  title: string;
  id: string;
  serviceName: FrequentServicesIdEnum;
  priority: number;
  tags?: string[];
  status: AppServiceStatusEnum;
  type: ServiceTypeEnum;
  categories: Array<AppServiceCategoryInterface>;
  badge?: AppServiceBadge;
}
