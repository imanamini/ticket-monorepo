export interface PaymentLinkHeaderConfig {
  title: string;
  description: (cellNumber?: string) => string;
  errorStatus?: PaymentLinkError;
}
export type PaymentLinkHeaderStatus = 'warning' | 'success' | 'error';

export const PaymentLinkHeaderStatusIcon = {
  warning: 'error-circle',
  success: 'check-circle',
  error: 'close-circle',
} as const;
 
export enum PaymentLinkError {
  MERCHANT_NOT_FOUND = 1,
  DEFAULT = 2,
  INVALID_SIDE_TYPE = 3,
  REQUEST_EXPIRED = 4,
  LINK_EXPIRED = 5,
  REQUEST_ALREADY_USED = 6,
  MULTI_MERCHANTS = 7,
  ACTIVE_LINK_EXISTS = 8,
  ACTIVE_LINK_LIMIT_REACHED = 9,
}

export const PaymentLinkErrorTranslate = {
  [PaymentLinkError.MERCHANT_NOT_FOUND]: {
    title: 'کسب وکاری یافت نشد',
    description: (cellNumber?: string) => `برای شماره همراه ${cellNumber ?? 'شما'} در پنل فروشندگان دیجی‌پی،  کسب وکاری ثبت نشده است.
جهت ثبت نام در دیجی‌پی از طریق لینک زیر اقدام کنید.`,
    buttonText: 'پنل فروشندگان',
    redirectUrl: 'https://uatbusiness.mydigipay.info/auth/login',
  },
  [PaymentLinkError.DEFAULT]: {
    title: 'مشکلی پیش آمده است',
    description: () => `لطفا دقایقی دیگر مجددا تلاش کنید.`,
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.INVALID_SIDE_TYPE]: {
    title: 'امکان ساخت لینک پرداخت ندارید.',
    description: () => 'برای شروع فرآیند خرید، از فروشنده بخواهید لینک پرداخت بسازد.',
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.REQUEST_EXPIRED]: {
    title: 'لینک پرداخت منقضی شده است',
    description: () => `برای پرداخت، از فروشنده بخواهید لینک جدید بسازد.`,
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.LINK_EXPIRED]: {
    title: 'لینک پرداخت منقضی شده است',
    description: () => `برای پرداخت، از فروشنده بخواهید لینک جدید بسازد.`,
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.REQUEST_ALREADY_USED]: {
    title: 'لینک پرداخت قبلا استفاده شده است',
    description: () => 'برای پرداخت، از فروشنده بخواهید لینک جدید بسازد.',
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.MULTI_MERCHANTS]: {
    title: 'مشکلی پیش آمده است',
    description: () => 'برای این شماره همراه، در پنل فروشندگان دیجی پی، بیشتر از یک کسب وکار ثبت شده است.',
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.ACTIVE_LINK_EXISTS]: {
    title: 'امکان ساخت لینک پرداخت ندارید',
    description: () => 'برای این خریدار، یک لینک پرداخت فعال وجود دارد.',
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
  [PaymentLinkError.ACTIVE_LINK_LIMIT_REACHED]: {
    title: 'امکان ساخت لینک پرداخت جدید ندارید.',
    description: () => 'تعداد لینک های پرداخت فعال شما بیش از حد مجاز است.',
    buttonText: 'متوجه شدم',
    redirectUrl: 'https://open-platform-redirect.divar.ir/completion',
  },
} as const;



export enum PaymentLinkCustomError {
  MARKETPLACE_LINK_EXPIRED = 18012,
}