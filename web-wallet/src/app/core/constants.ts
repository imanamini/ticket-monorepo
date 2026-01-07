export enum OTP_USE_CASES {
  PURCHASE = 'PURCHASE',
  ACTIVATE = 'ACTIVATE',
}

export enum PAYMENT_TYPES {
  PURCHASE_CASH_IN = 'PAYMENT_CASH_IN',
  SUBSCRIPTION_CASH_IN = 'SUBSCRIPTION_CASH_IN',
  CASH_IN = 'CASH_IN'
}

export const FAILURE_DATA = [
  {
    key: 'result',
    value: 'FAILURE'
  }
];

export enum PERSISTENT_STORAGE_KEYS {
  CASH_IN = '__cash_in_ticket',
}

export enum PERSISTENT_STORAGE_KEYS {
  CALLBACK_URL = '__callback_url',
  TIMER = '__timer_',
  TTL = '__ttl',
  PHONE_NUMBER = '__phone_number',
}

export enum PERSISTENT_STORAGE_KEYS {
  DIRECT_DEBIT = '__direct_debit',
  DIRECT_DEBIT_TICKET_INFO = '__direct_debit_ticket_info',
  CONTRACT_INFO = '__direct_debit_contract-info',
  DIRECT_DEBIT_USER_INFO = '__direct_debit_user-info'
}

// TGS
export enum PERSISTENT_STORAGE_KEYS {
  TGS_TICKET_INFO = '__tgs_ticket_info',
  TGS_SELECTED_FEATURE = '__tgs_selected_feature',
  CASH_IN_FEATURE = '__tgs_cash_in_feature',
  IS_CASH_IN_REDIRECT = '__tgs_is_cash_in_redirect',
  START_TIME = '__tgs_start_time',
  OTP_START_TIME = '__otp_start_time',
  TGS_TICKET = '__tgs_ticket'
}
