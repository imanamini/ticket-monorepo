import { CardConfigInterface } from '../models/card-config.interface';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';

export const OTP_PAYMENT_WALLET_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'تایید و پرداخت',
};

export const OTP_PAYMENT_BPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اعتباری',
  submitText: 'تایید و پرداخت',
};

export const OTP_PAYMENT_CPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اقساطی',
  submitText: 'تایید و پرداخت',
};

export const OTP_CARD_CONFIG = {
  [APP_ACTIONS.PAYMENT_WALLET]: OTP_PAYMENT_WALLET_CARD_CONFIG,
  [APP_ACTIONS.PAYMENT_BPG]: OTP_PAYMENT_BPG_CARD_CONFIG,
  [APP_ACTIONS.PAYMENT_CPG]: OTP_PAYMENT_CPG_CARD_CONFIG,
};
