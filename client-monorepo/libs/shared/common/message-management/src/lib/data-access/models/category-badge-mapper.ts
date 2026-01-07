import { AppMessagingCategoryEnum } from './message-categories.interface';
import { MessageBadgeInterface } from './message-badge.interface';

export const CATEGORY_BADGE_MAPPER: Partial<Record<AppMessagingCategoryEnum, MessageBadgeInterface>> = {
  [AppMessagingCategoryEnum.SPECIAL_OFFER]: {
    mode: 'bold',
    status: 'error',
    text: 'پیشنهاد ویژه',
    type: 'text',
  },
  [AppMessagingCategoryEnum.ACTIVITIES]: {
    mode: 'bold',
    status: 'info',
    text: 'فعالیت‌ها',
    type: 'text',
  },
  [AppMessagingCategoryEnum.NOTIFICATIONS]: {
    mode: 'bold',
    status: 'neutral',
    text: 'اطلاع‌رسانی‌ها',
    type: 'text',
  },
};
