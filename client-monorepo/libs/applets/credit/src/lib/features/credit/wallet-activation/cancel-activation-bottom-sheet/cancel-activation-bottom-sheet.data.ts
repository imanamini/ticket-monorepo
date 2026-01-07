import { CancelActivationMessage, CancelActivationMessageAction } from './cancel-activation-bottom-sheet.model';

export const IMPOSSIBLE_MESSAGE: CancelActivationMessage = {
  image: 'error',
  title: 'در این مرحله امکان لغو فرایند وجود ندارد',
  description: 'ما درحال بررسی درخواست شما هستیم و باتوجه به اینکه تمام مراحل را طی کرده‌اید دیگر امکان لغو فرایند ثبت‌نام وجود ندارد.',
  buttons: [
    {
      label: 'متوجه شدم',
      id: CancelActivationMessageAction.CLOSE,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};
export const ABOVE_LIMITATION_MESSAGE: CancelActivationMessage = {
  image: 'question',
  title: 'محدودیت سقف درخواست لغو فرایند',
  description:
    'شما ۵ بار در یک روز امکان لغو فرایند ثبت‌نام خود را دارید. با توجه به پر شدن سقف امروز شما، برای ثبت درخواست فردا اقدام کنید.',
  buttons: [
    {
      label: 'متوجه شدم',
      id: CancelActivationMessageAction.CLOSE,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};
export const ABOVE_LIMITATION_MONTHLY_MESSAGE: CancelActivationMessage = {
  image: 'question',
  title: 'محدودیت سقف ماهیانه درخواست لغو فرایند',
  description:
    'شما ۱۰ بار در یک ماه امکان لغو فرایند ثبت‌نام خود را دارید.با توجه به پر شدن سقف این ماه، برای ثبت درخواست تا پایان ماه صبر کنید.',
  buttons: [
    {
      label: 'متوجه شدم',
      id: CancelActivationMessageAction.CLOSE,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};
export const POSSIBLE_MESSAGE: CancelActivationMessage = {
  image: 'question',
  title: 'لغو فرایند ثبت‌نام',
  description:
    'درصورت لغو فرایند ثبت‌نام و اقدام به ثبت‌نام طرح جدید، مراحل ثبت‌نام شما از ابتدا صورت خواهد گرفت.آیا از لغو فرایند اطمینان دارید؟',
  buttons: [
    {
      label: 'بستن',
      id: CancelActivationMessageAction.CLOSE,
      style: 'tinted-on-elevated',
      mode: 'form',
      fullWidth: true,
    },
    {
      label: 'اطمینان دارم',
      id: CancelActivationMessageAction.CONFIRM,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};
export const POSSIBLE_BY_OPERATION_MESSAGE: CancelActivationMessage = {
  image: 'question',
  title: 'لغو فرایند ثبت‌نام',
  description: 'برای لغو این فرایند لازم است درخواست خود را برای واحد پشتیبانی ثبت کنید تا ثبت‌نام شما توسط همکاران ما لغو شود.',
  buttons: [
    {
      label: 'بستن',
      id: CancelActivationMessageAction.CLOSE,
      style: 'tinted-on-elevated',
      mode: 'form',
      fullWidth: true,
    },
    {
      label: 'متوجه شدم',
      id: CancelActivationMessageAction.CONFIRM,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};

export const READY_TO_ARCHIVE_MESSAGE: CancelActivationMessage = {
  image: 'done',
  title: 'درخواست شما با موفقیت ثبت شد',
  description: '',
  buttons: [
    {
      label: 'متوجه شدم',
      id: CancelActivationMessageAction.READY_TO_ARCHIVE_DONE,
      style: 'fill',
      mode: 'form',
      fullWidth: true,
    },
  ],
};
