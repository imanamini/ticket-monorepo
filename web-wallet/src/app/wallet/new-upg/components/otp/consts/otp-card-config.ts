import { CardConfigInterface } from '../../card/card-config.interface';
import { UpgFeatureName } from '../../../../../api/emuns/upg-feature-name.emun';

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
  [UpgFeatureName.PAYMENT_WALLET]: OTP_PAYMENT_WALLET_CARD_CONFIG,
  [UpgFeatureName.PAYMENT_BPG]: OTP_PAYMENT_BPG_CARD_CONFIG,
  [UpgFeatureName.PAYMENT_CPG]: OTP_PAYMENT_CPG_CARD_CONFIG,
};
