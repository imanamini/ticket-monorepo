import { ProfileMenuGroupInterface } from '../models/profile-menu-group-item.interface';
import { APP_NAME_ENUM } from '@client-monorepo/common/utilities';

export const profileMenusConst: {
  [key: string]: ProfileMenuGroupInterface;
} = {
  accountMenuItems: {
    title: 'مدیریت حساب',
    menu: [
      {
        title: 'رمز عبور',
        icon: 'Lock',
        link: ['/profile', 'manage-password'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'دستگاه‌های متصل',
        icon: 'digital-device',
        link: ['/profile', 'sessions'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'کارت‌های ذخیره شده',
        icon: 'Bank-Card',
        link: ['/profile', 'saved-cards'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
    ],
  },
  alertMenuItems: {
    title: 'اطلاع رسانی',
    // {
    //   title: 'پیام‌ها',
    //   icon: 'Notification',
    //   disabled: true,
    //   link: ['/profile', 'notifications'],
    // },
    // {
    //   title: 'ثبت دیدگاه',
    //   icon: 'Consulting',
    //   link: ['/profile', 'feedback'],
    // },
    menu: [
      {
        title: 'دعوت از دوستان',
        icon: 'Add-Friend',
        link: ['/profile', 'referral'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
    ],
  },
  supportMenuItems: {
    title: 'پشتیبانی',
    // {
    //   title: 'چت با پشتیبانی',
    //   icon: 'consulting',
    //   isEmitter: true,
    // },
    menu: [
      {
        title: 'راهنما',
        icon: 'question-mark-circle',
        isEmitter: true,
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'درباره ما',
        icon: 'Group',
        link: ['/profile', 'about-us'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'گزارش تخلف فروشگاه',
        icon: 'error-circle',
        link: ['/stores', 'violation'],
        apps: [APP_NAME_ENUM.DPX],
      },
      {
        title: 'تماس با پشتیبانی',
        icon: 'headphone',
        isEmitter: true,
        apps: [APP_NAME_ENUM.PILLAR],
      },
      {
        title: 'شرایط و مقررات استفاده',
        icon: 'docuemnt-file',
        link: ['/profile', 'rules'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.PILLAR, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'به روزرسانی',
        icon: 'Mobile',
        link: ['/profile', 'update'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.EXPRESS],
      },
      {
        title: 'پشتیبانی آنلاین',
        icon: 'consulting',
        link: ['/profile', 'chatbot'],
        apps: [APP_NAME_ENUM.DPX, APP_NAME_ENUM.PILLAR],
      },
    ],
  },
};
