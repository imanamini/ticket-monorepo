export enum VerifyOtpStatus {
  FAILED = 0,
  SUCCESS = 1, // *
  PENDING = 2,
  INVALID_OTP = 3, // *
  OTP_CONFIRMED_BEFORE = 4,
  CODE_IS_EXPIRED_TRY_AGAIN = 5, // *
  REQUEST_IS_INVALID = 6,
  COUNT_OF_UNSUCCESSFUL_RETRY_IS_NOT_LEGAL = 7, // *
  SEND_OTP_MAX_RETRY_REACHED = 8, // *
}

export interface VerifyOtpAction {
  type: 'errorMessage' | 'snack' | 'resend' | 'nextStep';
  message: string;
}

export const VerifyOtpActionMap: {[key in VerifyOtpStatus]: VerifyOtpAction} = {
  [VerifyOtpStatus.SUCCESS]: {type: 'nextStep', message: ''},
  [VerifyOtpStatus.INVALID_OTP]: {type: 'errorMessage', message: 'کد اشتباه وارد شده است'},
  [VerifyOtpStatus.PENDING]: {type: 'snack', message: 'خطا: فنی'},
  [VerifyOtpStatus.FAILED]: {type: 'snack', message: 'خطا: فنی'},
  [VerifyOtpStatus.OTP_CONFIRMED_BEFORE]: {type: 'snack', message: 'خطا: فنی'},
  [VerifyOtpStatus.CODE_IS_EXPIRED_TRY_AGAIN]: {type: 'resend', message: 'کد ارسال شده منقضی شده'},
  [VerifyOtpStatus.REQUEST_IS_INVALID]: {type: 'snack', message: 'خطا: فنی'},
  [VerifyOtpStatus.COUNT_OF_UNSUCCESSFUL_RETRY_IS_NOT_LEGAL]: {type: 'snack', message: 'تعداد دفعات درخواست کد هویت‌سنجی بیش از حد مجاز است! مرحله هویت‌سنجی مجددا اجرا می‌شود!'},
  [VerifyOtpStatus.SEND_OTP_MAX_RETRY_REACHED]: {type: 'snack', message: 'تعداد دفعات درخواست کد هویت‌سنجی بیش از حد مجاز است! مرحله هویت‌سنجی مجددا اجرا می‌شود!'},
};
