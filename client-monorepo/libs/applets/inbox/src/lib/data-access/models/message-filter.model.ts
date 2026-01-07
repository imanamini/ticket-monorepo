import { AppMessagingCategoryEnum } from '@client-monorepo/shared/common';

export interface MessageFilterModel {
  order: number;
  id: string;
  value?: AppMessagingCategoryEnum;
  label: string;
  clickDisabled: boolean;
  pressed: boolean;
  icon: string;
}
