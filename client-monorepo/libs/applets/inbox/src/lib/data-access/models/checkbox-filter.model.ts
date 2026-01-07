import { AppMessagingCategoryEnum } from '@client-monorepo/shared/common';

export interface CheckboxFilterModel {
  id: Partial<AppMessagingCategoryEnum>;
  title: string;
  checked: boolean;
}
