import { OnBoardingSlidesModel, RgbaColorModel } from '../models/on-boarding-slides.model';

const firstColorRgba: RgbaColorModel = { r: 0, g: 91, b: 255, a: 0.06, position: -12.62 };
const secondColorRgba: RgbaColorModel = { r: 255, g: 255, b: 255, a: 0.06, position: 97.75 };

export const onboardingSlides: OnBoardingSlidesModel[] = [
  {
    id: 0,
    title: 'خدمات مالی، متنوع و هوشمند!',
    text: 'از کارت به کارت، خرید شارژ و اینترنت، تا پرداخت قبض رو سریع و راحت انجام بده.',
    backgroundGradient: {
      firstColorRGBA: firstColorRgba,
      secondColorRGBA: secondColorRgba,
      degree: 177,
    },
    imageUrl: 'assets/onboarding/onboarding-c2c.svg',
  },
  {
    id: 1,
    title: 'خرید اقساطی، ساده و بدون ضامن!',
    text: 'باتوجه به سوابق و رفتار‌های مالی‌، وام و اعتبار بگیر و از کلی فروشگاه به صورت آنلاین و حضوری خرید کن.',
    backgroundGradient: {
      firstColorRGBA: firstColorRgba,
      secondColorRGBA: secondColorRgba,
      degree: 177,
    },
    imageUrl: 'assets/onboarding/onboarding-credit.png',
  },
  {
    id: 2,
    title: 'خدمات بیمه‌، نقدی و اقساطی!',
    text: 'آنلاین مقایسه کن و از بین ده‌ها بیمه‌گذار، نقدی یا اقساطی بیمه بخر.',
    backgroundGradient: {
      firstColorRGBA: firstColorRgba,
      secondColorRGBA: secondColorRgba,
      degree: 177,
    },
    imageUrl: 'assets/onboarding/onboarding-insurance.svg',
  },
  {
    id: 3,
    title: '‌سرمایه‌گذاری، راحت و بدون ریسک!',
    text: 'بدون ریسک در صندوق‌های درامد ثابت سرمایه‌گذاری و سود کن.',
    backgroundGradient: {
      firstColorRGBA: firstColorRgba,
      secondColorRGBA: secondColorRgba,
      degree: 177,
    },
    imageUrl: 'assets/onboarding/onboarding-wealth.svg',
  },
];
