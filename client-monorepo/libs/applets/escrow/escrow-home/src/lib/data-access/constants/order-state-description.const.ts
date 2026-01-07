import { ORDER_STATE } from '../enums/order-state.enum';

export const ORDER_STATE_DESCRIPTIONS: { [key in ORDER_STATE]?: string } = {
  [ORDER_STATE.VERIFIED]: 'تایید سفارش شما توسط فروشنده ممکن است تا ۱ روز کاری طول بکشد. ',
  [ORDER_STATE.CONFIRM]: 'تبریک! فروشنده سفارش شما را تایید کرد و در حال آماده‌سازی برای ارسال است. ',
  [ORDER_STATE.DELIVER_IN_PROGRESS]:
    'در صورتی که پس از گذشت ۴۸ ساعت از ارسال فروشنده، مرسوله را تحویل نگرفتید با پشتیبانی دیجی‌پی در تماس باشید.',
  [ORDER_STATE.CONFLICT]: 'مشکل شما توسط پشتیبانی درحال بررسی است و پس از بررسی با شما ارتباط می‌گیریم. ',
  [ORDER_STATE.DELIVER]: 'از اعتماد و خرید شما متشکریم. لطفا تجربه خریدتان را با انتخاب یک گزینه با ما به اشتراک بگذارید. ',
  [ORDER_STATE.REFUND]: 'سفارش شما توسط فروشگاه لغو شد. ',
};
