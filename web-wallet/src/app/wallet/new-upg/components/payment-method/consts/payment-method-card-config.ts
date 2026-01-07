import { CardConfigInterface } from '../../card/card-config.interface';

export const PAYMENT_METHOD_DEFAULT_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'روش‌های پرداخت',
  submitText: 'تایید و پرداخت',
};

export const PAYMENT_CASH_IN_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'افزایش موجودی و پرداخت',
};

export const PAYMENT_IPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'درگاه پرداخت دیجی‌پی',
  submitText: 'تایید و پرداخت',
};

export const PAYMENT_WALLET_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'ادامه',
};

export const PAYMENT_BPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اعتباری',
  submitText: 'ادامه',
};

export const PAYMENT_CPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اقساطی',
  submitText: 'ادامه',
};

export const PAYMENT_CREDIT_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کردیت کارت',
  submitText: 'ادامه',
};
