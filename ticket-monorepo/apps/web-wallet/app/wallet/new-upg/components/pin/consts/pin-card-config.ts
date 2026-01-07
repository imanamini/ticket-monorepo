import { CardConfigInterface } from '../../card/card-config.interface';
import { UpgFeatureName } from '../../../../../api/emuns/upg-feature-name.emun';

export const PIN_PAYMENT_WALLET_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت با کیف پول',
  submitText: 'تایید و پرداخت',
};

export const PIN_PAYMENT_BPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اعتباری',
  submitText: 'تایید و پرداخت',
};

export const PIN_PAYMENT_CPG_CARD_CONFIG: CardConfigInterface = {
  headerTitle: 'پرداخت اقساطی',
  submitText: 'تایید و پرداخت',
};

export const PIN_CARD_CONFIG = {
  [UpgFeatureName.PAYMENT_WALLET]: PIN_PAYMENT_WALLET_CARD_CONFIG,
  [UpgFeatureName.PAYMENT_BPG]: PIN_PAYMENT_BPG_CARD_CONFIG,
  [UpgFeatureName.PAYMENT_CPG]: PIN_PAYMENT_CPG_CARD_CONFIG,
};
