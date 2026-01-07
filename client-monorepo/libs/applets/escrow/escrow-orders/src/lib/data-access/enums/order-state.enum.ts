export enum ORDER_STATE {
  INITIATE = 0,
  PURCHASE_IN_PROGRESS = 1,
  PAID = 2,
  VERIFIED = 3,
  PAYMENT_FAilURE = 4,
  FAIL = 5,
  CONFIRM = 6,
  REFUND_IN_PROGRESS = 7,
  REFUND = 8,
  REFUND_FAIlURE = 9,
  REFUND_RETRY_EXCEEDED = 10,
  DELIVER_IN_PROGRESS = 11,
  DELIVER = 12,
  CONFLICT = 13,
}

export const ORDER_STATE_TRANSLATION: { [key in ORDER_STATE]?: string } = {
  [ORDER_STATE.PURCHASE_IN_PROGRESS]: 'در حال پرداخت',
  [ORDER_STATE.DELIVER]: 'تکمیل شده',
  [ORDER_STATE.PAID]: 'پرداخت شده',
  [ORDER_STATE.REFUND]: 'لغو شده',
  [ORDER_STATE.VERIFIED]: 'تایید شده',
  [ORDER_STATE.DELIVER_IN_PROGRESS]: 'ارسال شده',
  [ORDER_STATE.CONFIRM]: 'در انتظار ارسال',
  [ORDER_STATE.CONFLICT]: 'مشکل در تحویل سفارش',
};
