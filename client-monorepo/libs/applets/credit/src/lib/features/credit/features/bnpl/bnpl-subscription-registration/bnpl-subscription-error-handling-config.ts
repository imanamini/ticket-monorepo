import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

export enum BnplSubscriptionButtonAction {
  RETURN_TO_FORM = 'RETURN_TO_FORM',
  TYPE_AGAIN = 'TYPE_AGAIN',
  CLOSE = 'CLOSE',
}

export enum STATUS_TYPE {
  LOADING = 1,
  SUCCESS = 2,
  MAXIMUM_TRY_ERROR = 429,
  NOT_AVAILABLE = 1118,
  NATIONAL_CODE_ERROR = 5356,
  USER_DECEASED = 5357,
  BIRTH_DATE_ERROR = 5355,
}

export interface BnplSubscriptionErrorConfig {
  title: string;
  description: string;
  buttons?: Buttons[];
  loading?: boolean;
  image: string;
}

export const bnplSubscriptionErrorHandlingConfig: {
  [key: number]: BnplSubscriptionErrorConfig;
} = {
  [STATUS_TYPE.SUCCESS]: {
    title: 'در حال انتقال به خرید اشتراک',
    description: 'شما به زودی به خرید اشتراک منتقل می شوید',
    loading: true,
    image: 'success'
  },
  [STATUS_TYPE.LOADING]: {
    title: 'در حال بررسی اطلاعات فردی شما',
    description: 'ما در حال استعلام و بررسی اطلاعات هویتی شما هستیم.',
    loading: true,
    image: 'searching'
  },
  [STATUS_TYPE.MAXIMUM_TRY_ERROR]: {
    title: 'تعداد درخواست روزانه مجاز شما به اتمام رسیده است.',
    description: 'برای درخواست دوباره، ۲۴ ساعت دیگر اقدام کنید.',
    buttons: [
      {
        id: BnplSubscriptionButtonAction.CLOSE,
        style: 'tinted-on-elevated',
        label: 'بازگشت',
        mode: 'form'
      }
    ],
    image: 'maximum-try'
  },

  [STATUS_TYPE.NOT_AVAILABLE]: {
    title: 'سرویس احراز هویت در دسترس نیست',
    description: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
    buttons: [
      {
        id: BnplSubscriptionButtonAction.RETURN_TO_FORM,
        style: 'tinted-on-elevated',
        label: 'تلاش دوباره',
        mode: 'form'
      },
      {
        id: BnplSubscriptionButtonAction.CLOSE,
        style: 'link',
        label: 'بازگشت',
        mode: 'form'
      }
    ],
    image: 'cloud'
  },
  [STATUS_TYPE.NATIONAL_CODE_ERROR]: {
    title: 'کدملی واردشده متعلق به مالک خط {} نیست',
    description: 'برای خرید اشتراک، شماره همراهی که که با آن وارد دیجی‌‌پی شده اید باید به نام خودتان باشد.',
    buttons: [
      {
        id: BnplSubscriptionButtonAction.RETURN_TO_FORM,
        style: 'tinted-on-elevated',
        label: 'بازگشت',
        mode: 'form'
      }
    ],
    image: 'national-code'
  },
  [STATUS_TYPE.USER_DECEASED]: {
    title: 'صاحب این کد ملی فوت شده است',
    description: 'امکان خرید اشتراک با این کد ملی وجود ندارد.',
    buttons: [
      {
        id: BnplSubscriptionButtonAction.CLOSE,
        style: 'tinted-on-elevated',
        label: 'بازگشت',
        mode: 'form'
      }
    ],
    image: 'died'
  },
  [STATUS_TYPE.BIRTH_DATE_ERROR]: {
    title: 'تاریخ تولد وارد شده اشتباه است.',
    description: 'برای خرید اشتراک، لطفا تاریخ تولد مالک خط را وارد کنید',
    buttons: [
      {
        id: BnplSubscriptionButtonAction.RETURN_TO_FORM,
        style: 'tinted-on-elevated',
        label: 'بازگشت',
        mode: 'form'
      }
    ],
    image: 'birthdate'
  }
};
