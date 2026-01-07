export interface SmartScoringOnboardingModel {
  id: number;
  title: string;
  description: string;
  ctaText: string;
}

export const smartScoringOnboardingSlidesConstant: SmartScoringOnboardingModel[] = [
  {
    id: 0,
    title: 'دریافت امتیاز در چند دقیقه',
    description:
      'از همین حالا با یک فرایند سریع و بدون کاغذبازی شروع کن! فقط چند اطلاعات ساده وارد کن تا ما در لحظه شرایطت رو بسنجیم و بهترین پیشنهاد وام رو بهت بدیم.',
    ctaText: 'ادامه',
  },
  {
    id: 1,
    title: 'وام شما، به انتخاب شما',
    description:
      'بر اساس امتیازت، مبلغ و شرایط وام رو شفاف نشونت می‌دیم. انتخاب با توئه ما همه‌چیز رو واضح می‌گیم تا با خیال راحت تصمیم بگیری.',
    ctaText: 'ادامه',
  },
  {
    id: 2,
    title: 'ثبت ضمانت به‌صورت آنلاین',
    description:
      'برای تکمیل تخصیص وامت، ضمانت رو با چک یا سفته الکترونیکی ثبت کن. همه‌چیز آنلاین و فوریه؛ بعد از تأیید، وامت فعال میشه و می‌تونی از فروشگاه‌های آنلاین و حضوری طرف قرارداد خرید کنی.',
    ctaText: 'متوجه شدم',
  },
];
