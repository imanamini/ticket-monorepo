export const PAYMENT_ORDER_STATUSES: { [key: number]: string } = {
  0: 'SUCCESS',
  1: 'PENDING',
  2: 'REFUNDING',
  3: 'REFUNDED',
  4: 'CANCELED',
  5: 'UNPAYABLE',
  6: 'PAY_IN_PROGRESS',
  7: 'OVERDUE',
  8: 'TODAY',
};

export const PAYABLE_INSTALLMENT_STATUSES = ['PENDING', 'TODAY', 'OVERDUE'];

export const transformPaymentOrderStatusToText = (statusCode: number) => {
  return PAYMENT_ORDER_STATUSES[statusCode];
};
