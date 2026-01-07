import {
  ChequeOnBoardingResponse
} from '../../../data-access/models/credit/activation/cheque-step/cheque-on-boarding.response';

export const ONBOARDING: ChequeOnBoardingResponse = {
  buttonLabel: 'تایید و ادامه',
  imageId: 'cheque-upload-in-progress',
  messages: [
    'وارد کردن اطلاعات چک‌ها برای بررسی و تایید',
    'نوشتن چک‌ها بر اساس راهنما',
    ' بارگذاری تصویر چک‌ها برای بررسی',
    ' ثبت چک‌ها در سامانه‌‌های نظارت بر چک صیادی',
    'ارسال چک‌ها به دفتر دیجی‌پی',
  ],
  title: 'ثبت چک‌های اقساط',
  subTitle: 'ثبت تصویر چک‌های اقساط',
  message: 'در این مرحله بعد از مراحل ثبت چک، باید منتظر نتیجه بررسی باشید.',
};
