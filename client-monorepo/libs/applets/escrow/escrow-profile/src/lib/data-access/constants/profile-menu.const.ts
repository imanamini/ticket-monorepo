import {ProfileMenuItemInterface} from '../models/profile-menu-group-item.interface';

export const ESCROW_PROFILE_MENU: ProfileMenuItemInterface[] = [
  {
    title: 'سوالات متداول',
    icon: 'question-mark-circle',
    link: ['/profile', 'faq'],
    disabled: false,
    comingSoon: false,
    hasArrow: true
  },
  {
    title: 'قوانین و مقررات',
    icon: 'signature',
    link: ['/auth', 'rules'],
    disabled: false,
    comingSoon: false,
    hasArrow: true
  },
  {
    title: 'ایجاد فروشگاه',
    icon: 'shopping-bag',
    link: [''],
    disabled: true,
    comingSoon: true,
    hasArrow: true
  },
  {
    title: 'رمز عبور',
    icon: 'lock',
    link: [''],
    disabled: true,
    comingSoon: true,
    hasArrow: true
  },
  {
    title: 'خروج از حساب کاربری',
    icon: 'logout',
    link: [''],
    disabled: false,
    comingSoon: false,
    hasArrow: false,
    isEmitter: true
  },
];
