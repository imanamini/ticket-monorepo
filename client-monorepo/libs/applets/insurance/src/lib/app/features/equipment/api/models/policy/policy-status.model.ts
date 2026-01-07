export const POLICY_STATUS = {
  10: 'Pending',
  20: 'Locked',
  100: 'Finalized',
  200: 'Freezed',
  210: 'Settled',
  250: 'Cancelled',
  255: 'Refunded',
  220: 'Expired'
  // Pending
  // Paid
  // Active
  // Canceled
  // Expired
  // Terminated
};

export const POLICY_STATUS_TRANSLATION = {
  Pending: 'در انتظار', // Waiting for payment to be done and policies to be confirmed
  Locked: 'در انتظار پرداخت', // Waiting for payment to be done and policies to be confirmed
  Finalized: 'نهایی شده', // Owner payed whole money of the order , All bought policies confirmed buy owner
  Freezed: 'غیر قابل برگشت', // User cannot cancel , Settlement should be done
  Settled: 'تسویه شده', // All partners got their cuts
  Cancelled: 'کنسل شده', // Whole order cancelled ,If has payment so has to refund.
  Refunded: 'استرداد شده', // Cancelled order payment returned.
  Expired: 'منقضی شده'
};
