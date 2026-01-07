import { ActionInterface } from '@client-monorepo/common/utilities';
import { FrequentServicesIdEnum } from './frequent-services-id.enum';
import { AppServiceCategoryInterface } from './app-service-category.interface';
import { ServiceTypeEnum } from './service-type.enum';
import { AppServiceBadge } from './app-service-badge.interface';
import { AppServiceStatusEnum } from './app-service-status.enum';
import { ServiceImagesType } from './service-images-type.enum';

export interface FrequentServiceInterface {
  uuid?: string;
  status?: AppServiceStatusEnum;
  id: FrequentServicesIdEnum;
  title?: string;
  icon?: string;
  image?: string;
  primaryColor?: string;
  secondaryColor?: string;
  selected: boolean;
  docked?: boolean;
  action?: ActionInterface;
  logoType: 'icon' | 'logo'; // for support old frequent service preview
  priority?: number;
  userPriority?: number | null;
  categories?: Array<AppServiceCategoryInterface>;
  type?: ServiceTypeEnum;
  tags?: Array<string>;
  badge?: AppServiceBadge;
  imageType: ServiceImagesType; // for support new framed-icon component
}
