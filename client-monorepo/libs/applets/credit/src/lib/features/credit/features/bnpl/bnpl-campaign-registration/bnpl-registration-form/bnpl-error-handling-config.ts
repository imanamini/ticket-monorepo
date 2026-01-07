import { Buttons } from '@digipay/ngx-status-result';

export interface BnplErrorConfig {
  image?: string;
  title?: string;
  description?: string;
  buttons?: Buttons[];
  hasTimer?: boolean;
}

export enum STATUS_TYPE {
  LOADING = 1,
  SUCCESS = 2,
  NOT_AVAILABLE = 1118,
  USER_DECEASED = 5357,
  BIRTH_DATE_ERROR = 5355,
  NATIONAL_ID_ERROR = 5356,
  FUND_ERROR = 16811,
  DUPLICATE_CREDIT_ERROR = 5352,
  DUPLICATE_CREDIT_NATIONAL_ID_ERROR = 5353,
  DIGIPAY_BLOCK = 5354,
  TOO_MANY_REQUEST = 429,
  TOKEN_EXPIRED = 401,
}

export const bnplErrorHandlingConfig: { [key: number]: BnplErrorConfig } = {
  [STATUS_TYPE.NOT_AVAILABLE]: {
    image: 'bnpl-not-available-icon',
    title: 'سرویس‌دهنده در دسترس نیست.',
    description: 'به محض برقراری ارتباط برای ادامه فرایند امکان‌سنجی، از طریق پیامک اطلاع‌رسانی خواهیم کرد.',
    buttons: [
      {
        style: 'link',
        id: 'retry',
        label: 'تلاش مجدد',
        mode: 'form',
      },
      {
        style: 'link',
        id: 'return-to-merchant',
        label: 'بازگشت به فروشگاه',
        mode: 'form',
      },
    ],
  },
  [STATUS_TYPE.NATIONAL_ID_ERROR]: {
    image: 'bnpl-national-id-error-icon',
    title: 'کد ملی وارد شده متعلق به مالک خط {{cellNumber}} نیست.',
    description:
      'برای دریافت اعتباراقساطی، شماره همراهی که که با آن وارد فروشگاه شده اید باید به نام خودتان باشد. لطفا شماره کدملی مالک خط را وارد کنید.',
    buttons: [
      {
        style: 'tinted-on-elevated',
        id: 'back-to-info-form',
        label: 'بازگشت',
        mode: 'form',
      },
    ],
  },
  [STATUS_TYPE.BIRTH_DATE_ERROR]: {
    image: 'bnpl-error-icon',
    title: 'تاریخ تولد وارد شده اشتباه است. ',
    description: 'برای دریافت اعتبار اقساطی، لطفا تاریخ تولد مالک خط را وارد کنید.',
    buttons: [
      {
        style: 'tinted-on-elevated',
        id: 'back-to-info-form',
        label: 'بازگشت',
        mode: 'form',
      },
    ],
  },
  [STATUS_TYPE.FUND_ERROR]: {
    title: 'اعتباراقساطی فعال برای تخصیص وجود ندارد.',
    description: 'در حال حاضر دسترسی به این سرویس امکان‌پذیر نسیت.',
  },
  [STATUS_TYPE.DUPLICATE_CREDIT_ERROR]: {
    image: 'bnpl-warn-icon',
    title: 'امکان دریافت چند طرح اعتباری با شماره همراه  {{cellNumber}} به صورت هم‌زمان وجود ندارد.',
    description: 'در حال حاضر با این شماره همراه یک طرح اعتباری فعال است و امکان فعالسازی طرح دیگری برای شما وجود ندارد.',
    hasTimer: true,
  },
  [STATUS_TYPE.DUPLICATE_CREDIT_NATIONAL_ID_ERROR]: {
    image: 'bnpl-warn-icon',
    title: 'امکان دریافت چند طرح اعتباری با کد ملی {{nationalCode}} و شماره همراه {{cellNumber}} به صورت هم‌زمان وجود ندارد.',
    description: 'در حال حاضر با این کد ملی یک طرح اعتباری فعال است و امکان فعالسازی طرح دیگری برای شما وجود ندارد.',
    hasTimer: true,
  },
  [STATUS_TYPE.DIGIPAY_BLOCK]: {
    image: 'bnpl-block-icon',
    title: 'شما دارای اقساط معوق در دیجی‌پی هستید',
    description:
      'به علت وجود بدهی، انجام این مرحله برای شما امکان‌پذیر نیست. شما می‌توانید ۲۴ ساعت بعد از پرداخت بدهی دوباره درخواست استعلام سقف اعتبار اقساطی دهید.',
    hasTimer: true,
  },
  [STATUS_TYPE.TOO_MANY_REQUEST]: {
    image: 'bnpl-request-limit-icon',
    title: 'تعداد درخواست روزانه مجاز شما به اتمام رسیده است.',
    description: 'برای درخواست دوباره، ۲۴ ساعت دیگر اقدام کنید.',
    hasTimer: true,
  },
  [STATUS_TYPE.TOKEN_EXPIRED]: {
    image: 'bnpl-invalid-token-icon',
    title: 'درخواست اعتبار اقساطی منقضی شده است.',
    description: 'زمان مجاز درخواست فعالسازی اعتبار اقساطی به اتمام رسیده است لطفا مجددا تلاش کنید.',
    hasTimer: true,
  },
  [STATUS_TYPE.USER_DECEASED]: {
    image: 'bnpl-died-icon',
    title: 'صاحب این کد ملی فوت شده است',
    description: 'امکان خرید اشتراک با این کد ملی وجود ندارد.',
    buttons: [
      {
        style: 'tinted-on-elevated',
        id: 'back-to-info-form',
        label: 'بازگشت',
        mode: 'form',
      },
    ],
  },
};
