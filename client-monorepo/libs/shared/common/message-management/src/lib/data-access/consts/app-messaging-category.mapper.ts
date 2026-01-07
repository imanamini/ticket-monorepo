import { AppMessagingCategoryEnum } from '@client-monorepo/shared/common';

export const AppMessagingCategoryTitles: Partial<Record<AppMessagingCategoryEnum, string>> = {
  [AppMessagingCategoryEnum.CREDIT]: 'وام',
  [AppMessagingCategoryEnum.TOP_UP]: 'خرید شارژ',
  [AppMessagingCategoryEnum.INTERNET]: 'بسته اینترنت',
  [AppMessagingCategoryEnum.BNPL]: 'اعتبار',
  [AppMessagingCategoryEnum.INSURANCE]: 'بیمه',
  [AppMessagingCategoryEnum.WEALTH_WALLET]: 'کیف ثروت',
  [AppMessagingCategoryEnum.WEALTH]: 'سرمایه گذاری',
};
