import { BnplOnboardingFeature, BnplOnboardingStore } from '../models/bnpl-onboarding.model';

export const BNPL_ONBOARDING_FEATURES: BnplOnboardingFeature[] = [
  {
    icon: 'BNPL',
    title: 'اعتبار چهار قسطه',
    description: 'قسط اول هنگام خرید؛ ۳ قسط بعد، اول هر ماه',
    iconGradient: 'linear-gradient(180deg, #6895fd 0%, #1159fc 100%)',
  },
  {
    icon: '1Pay',
    title: 'اعتبار ماهانه',
    description: 'تسویه کل مبلغ خرید در اول ماه بعد',
    iconGradient: 'linear-gradient(180deg, #b291f2 0%, #884dff 100%)',
  },
];

export const BNPL_ONBOARDING_STORES: BnplOnboardingStore[] = [
  { name: 'دیجی‌کالا', logo: 'assets/stores/digikala.svg' },
  { name: 'بانه', logo: 'assets/stores/baneh.svg' },
  { name: 'فیلیمو', logo: 'assets/stores/filimo.svg' },
  { name: 'نت‌برگ', logo: 'assets/stores/netbarg.svg' },
  { name: 'آپارات', logo: 'assets/stores/aparat.svg' },
  { name: 'جت', logo: 'assets/stores/jet.svg' },
  { name: 'اسنپ‌فود', logo: 'assets/stores/snappfood.svg' },
];
