import { CardConfigInterface } from '../models/card-config.interface';

export const PAYMENT_METHOD_DEFAULT_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'روش‌های پرداخت',
  submitText: 'تایید و پرداخت',
  quickSubmitText: 'تایید و پرداخت سریع',
};

export const PAYMENT_CASH_IN_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'افزایش موجودی و پرداخت',
  quickSubmitText: 'افزایش موجودی و پرداخت',
};

export const PAYMENT_IPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'درگاه پرداخت دیجی‌پی',
  submitText: 'تایید و پرداخت',
  quickSubmitText: 'تایید و پرداخت سریع',
};

export const PAYMENT_WALLET_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'پرداخت با کیف‌پول',
  quickSubmitText: 'پرداخت سریع با کیف‌پول',
};

export const PAYMENT_BPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اعتباری',
  submitText: 'پرداخت با اعتبار',
  quickSubmitText: 'پرداخت سریع با اعتبار',
};

export const PAYMENT_CPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اقساطی',
  submitText: 'پرداخت',
  quickSubmitText: 'پرداخت سریع',
};

export const PAYMENT_CREDIT_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کردیت کارت',
  submitText: 'پرداخت',
  quickSubmitText: 'پرداخت سریع',
};
