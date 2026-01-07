import { Buttons } from '@digipay/ngx-status-result';

export interface BnplErrorConfig {
  image?: string;
  title?: string;
  description?: string;
  buttons?: Buttons[];
  hasTimer?: boolean;
}

export const bnplErrorHandlingConfig: { [key: number]: BnplErrorConfig } = {
  1118: {
    image: 'bnpl-not-available-icon',
    title: 'سرویس‌دهنده در دسترس نیست.',
    description: 'به محض برقراری ارتباط برای ادامه فرایند امکان‌سنجی، از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
    buttons: [
      {
        style: 'link',
        id: 'retry',
        label: 'تلاش مجدد',
        mode: 'form'
      },
      {
        style: 'link',
        id: 'return-to-merchant',
        label: 'بازگشت به فروشگاه',
        mode: 'form'
      }
    ]
  },
  5356: {
    image: 'bnpl-national-id-error-icon',
    title: 'کد ملی وارد شده متعلق به مالک خط {{cellNumber}} نیست.',
    description: 'برای دریافت اعتبار، شماره همراهی که که با آن وارد فروشگاه شده اید باید به نام خودتان باشد. لطفا شماره کدملی مالک خط را وارد کنید.',
    buttons: [{
      style: 'tinted-on-elevated', id: 'back-to-info-form', label: 'بازگشت',
      mode: 'form'
    }]
  },
  5355: {
    image: 'bnpl-error-icon',
    title: 'تاریخ تولد وارد شده اشتباه است. ',
    description: 'برای دریافت اعتبار، لطفا تاریخ تولد مالک خط را وارد کنید.',
    buttons: [{
      style: 'tinted-on-elevated', id: 'back-to-info-form', label: 'بازگشت',
      mode: 'form'
    }]
  },
  16811: {
    title: 'اعتبار فعال برای تخصیص وجود نداد.',
    description: 'در حال حاضر دسترسی به این سرویس امکان‌پذیر نسیت.',
    hasTimer: true,
  },
  5352: {
    image: 'bnpl-warn-icon',
    title: 'امکان دریافت چند طرح اعتباری با شماره همراه  {{cellNumber}} به صورت هم‌زمان وجود ندارد.',
    description: 'در حال حاضر با این شماره همراه یک طرح اعتباری فعال است و امکان فعالسازی طرح دیگری برای شما وجود ندارد.',
    hasTimer: true,
  },
  5353: {
    image: 'bnpl-warn-icon',
    title: 'امکان دریافت چند طرح اعتباری با کد ملی {{nationalCode}} و شماره همراه {{cellNumber}} به صورت هم‌زمان وجود ندارد.',
    description: 'در حال حاضر با این کد ملی یک طرح اعتباری فعال است و امکان فعالسازی طرح دیگری برای شما وجود ندارد.',
    hasTimer: true,
  },
  5354: {
    image: 'bnpl-block-icon',
    title: 'شما دارای اقساط معوق در دیجی‌پی هستید',
    description: 'به علت وجود بدهی، انجام این مرحله برای شما امکان‌پذیر نیست. شما می‌توانید ۲۴ ساعت بعد از پرداخت بدهی دوباره درخواست استعلام سقف  وام دهید.',
    hasTimer: true,
  },
  429: {
    image: 'bnpl-request-limit-icon',
    title: 'تعداد درخواست روزانه مجاز شما به اتمام رسیده است.',
    description: 'برای درخواست دوباره، ۲۴ ساعت دیگر اقدام کنید.',
    hasTimer: true,
  },
  401: {
    image: 'bnpl-invalid-token-icon',
    title: 'درخواست اعتبار منقضی شده است.',
    description: 'زمان مجاز درخواست فعالسازی اعتبار به اتمام رسیده است لطفا مجددا تلاش کنید.',
    hasTimer: true
  },
  5357: {
    image: 'bnpl-died-icon',
    title: 'صاحب این کد ملی فوت شده است',
    description: 'امکان خرید اشتراک با این کد ملی وجود ندارد.',
    buttons: [{
      style: 'tinted-on-elevated',
      id: 'back-to-info-form',
      label: 'بازگشت',
      mode: 'form'
    }]
  },
};
