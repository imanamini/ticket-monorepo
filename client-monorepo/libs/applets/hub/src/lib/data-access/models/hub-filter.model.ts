import { AppServiceCategoryNamesEnum } from '@client-monorepo/common/service-data';

export interface HubFilterModel {
  id: string;
  order: number;
  label: string;
  clickDisabled: boolean;
  value: AppServiceCategoryNamesEnum;
  pressed: boolean;
  iconColor: string;
}
