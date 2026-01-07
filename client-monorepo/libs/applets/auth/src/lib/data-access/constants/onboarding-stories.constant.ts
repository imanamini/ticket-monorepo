import { StoryInterface } from '@client-monorepo/common/story-carousel';

export const ONBOARDING_STORIES: StoryInterface[] = [
  {
    id: 0,
    title: 'خرید اقساطی، بدون ضامن',
    subtitle: 'باتوجه به سوابق و رفتار‌های مالی‌، وام و اعتبار بگیر و از کلی فروشگاه به صورت آنلاین و حضوری خرید کن.',
    image: 'assets/login-onboarding/credit.png',
    backgroundImage: 'assets/login-onboarding/bg-onboarding-credit.svg',
    backgroundColor: [
      { color: '#A17DEA', stop: '0%' },
      { color: '#824DEE', stop: '64.42%' },
      { color: 'rgba(55, 71, 180, 0.20)', stop: '100%' },
    ],
    duration: 3000,
  },
  {
    id: 1,
    title: 'خدمات مالی، هوشمند',
    subtitle: 'از کارت به کارت، خرید شارژ و اینترنت، تا پرداخت قبض رو سریع و آسان انجام بده.',
    image: 'assets/login-onboarding/mini-apps.png',
    backgroundImage: 'assets/login-onboarding/bg-onboarding-mini-apps.svg',
    backgroundColor: [
      { color: '#7582D9', stop: '0%' },
      { color: '#4959BF', stop: '70.45%' },
      { color: 'rgba(55, 71, 180, 0.20)', stop: '100%' },
    ],
    duration: 3000,
  },
  {
    id: 2,
    title: 'خدمات بیمه‌، اقساطی',
    subtitle: 'آنلاین مقایسه کن و از بین ده‌ها بیمه‌گذار، نقدی یا اقساطی بیمه بخر.',
    image: 'assets/login-onboarding/insurance.png',
    backgroundImage: 'assets/login-onboarding/bg-onboarding-insurance.svg',
    backgroundColor: [
      { color: '#4D8DE7', stop: '0%' },
      { color: '#1752A4', stop: '67.79%' },
      { color: 'rgba(2, 58, 136, 0.20)', stop: '100%' },
    ],
    duration: 3000,
  },
  {
    id: 3,
    title: '‌سرمایه‌گذاری، بدون ریسک',
    subtitle: 'بدون ریسک در صندوق‌های درامد ثابت سرمایه‌گذاری و سود کن.',
    image: 'assets/login-onboarding/wealth.png',
    backgroundImage: 'assets/login-onboarding/bg-onboarding-wealth.svg',
    backgroundColor: [
      { color: '#48C283', stop: '0%' },
      { color: '#2B9C5D', stop: '66.35%' },
      { color: 'rgba(32, 141, 78, 0.20)', stop: '100%' },
    ],
    duration: 3000,
  },
];
