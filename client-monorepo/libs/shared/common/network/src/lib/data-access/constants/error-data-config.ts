import { GeneralErrorTypes } from '../models/general-error-types';
import { ErrorConfig, ErrorCtaType, ErrorImageType } from '../models/error-config.model';

export const ERROR_DATA_CONFIG: { [key in GeneralErrorTypes]: ErrorConfig } = {
  SYSTEM_ERROR: {
    title: 'خطا در برقراری ارتباط',
    message: 'لطفا فیلترشکن خود را خاموش کنید.\nاگر مجددا این خطا را دریافت کردید،\nدقایقی دیگر امتحان کنید.',
    image: ErrorImageType.TYPE_1,
    cta: ErrorCtaType.RETURN_TO_HOME,
  },
  INTERNET_ERROR: {
    title: 'عدم دسترسی به اینترنت',
    message: 'لطفا اتصال اینترنت خود را بررسی کرده و\nدوباره تلاش کنید.',
    image: ErrorImageType.TYPE_2,
    cta: ErrorCtaType.RETRY,
  },
  TIMEOUT_ERROR: {
    title: 'مشکل دسترسی به اینترنت',
    message: 'لطفا اتصال اینترنت خود را بررسی کرده و\nدوباره تلاش کنید.',
    image: ErrorImageType.TYPE_2,
    cta: ErrorCtaType.RETRY,
  },
  ACCESS_ERROR: {
    title: 'فیلترشکن خود را خاموش کنید!',
    message: 'برای استفاده از این سرویس، لطفا فیلترشکن خود را خاموش کنید.',
    image: ErrorImageType.TYPE_4,
    cta: ErrorCtaType.RETRY,
  },
  UNAVAILABLE_SYSTEM_ERROR: {
    title: 'سرویس دهنده در دسترس نیست',
    message: 'لطفا مجددا تلاش کنید',
    image: ErrorImageType.TYPE_3,
    cta: ErrorCtaType.RETRY,
  },
};
