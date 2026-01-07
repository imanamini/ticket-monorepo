import { AppServiceCategoryNamesEnum } from '@client-monorepo/common/service-data';

export const InsideServiceData = {
  BNPL_SERVICE: {
    category: AppServiceCategoryNamesEnum.BNPL_SERVICES,
    title: 'پرداخت خدمات مالی روزمره',
    description: 'با اعتبار اقساطی دیجی‌پی',
    hasAction: true,
    actionUrl: 'hub/main-services?filter=bnpl_services',
    iconColor: '#4657C3',
  },
  WEALTH: {
    category: AppServiceCategoryNamesEnum.WEALTH,
    title: 'امنیت سرمایه در',
    description: 'مدیریت ثروت',
    hasAction: true,
    actionUrl: 'hub/main-services?filter=wealth',
    iconColor: '#57D176',
  },
  INSURANCE: {
    category: AppServiceCategoryNamesEnum.INSURANCE,
    title: 'قابل اعتماد مثل',
    description: 'خدمات بیمه‌ی دیجی‌پی',
    hasAction: true,
    actionUrl: 'hub/main-services?filter=insurance',
    iconColor: '#296ED6',
  },
  BILL: {
    category: AppServiceCategoryNamesEnum.BILL,
    title: 'پرداخت قبض',
    description: 'قبوض خدماتی',
    hasAction: false,
    actionUrl: '',
    iconColor: '#4657C3',
  },
};
