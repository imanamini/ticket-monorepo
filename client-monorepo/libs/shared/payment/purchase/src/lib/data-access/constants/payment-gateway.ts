import { FEATURE_NAMES, FEATURES } from './feature-names';

export const PAYMENT_GATEWAYS = {
  IPG: 0,
  DPG: 1,
  WALLET: 3,
  CPG: 4,
  // Reverse
  0: 'IPG',
  1: 'DPG',
  3: 'WALLET',
  4: 'CPG',
};

export const GATEWAY_TO_FEATURE_MAP = {
  WALLET: FEATURES[FEATURE_NAMES.PAYMENT_WALLET],
  IPG: FEATURES[FEATURE_NAMES.PAYMENT_IPG],
  DPG: FEATURES[FEATURE_NAMES.PAYMENT_DPG],
};

export enum PaymentChannels {
  API = 0,
  UPG = 1,
  SMART_POS = 2,
  QR = 3,
  ESCROW = 4,
  BARCODE = 5,
  LINUX_POS = 6,
  APP = 7,
}

export enum PurchaseModes {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export const PaymentChannelToPurchaseModeMapper: Record<PaymentChannels, PurchaseModes> = {
  [PaymentChannels.API]: PurchaseModes.ONLINE,
  [PaymentChannels.UPG]: PurchaseModes.ONLINE,
  [PaymentChannels.SMART_POS]: PurchaseModes.OFFLINE,
  [PaymentChannels.QR]: PurchaseModes.OFFLINE,
  [PaymentChannels.ESCROW]: PurchaseModes.ONLINE,
  [PaymentChannels.BARCODE]: PurchaseModes.OFFLINE,
  [PaymentChannels.LINUX_POS]: PurchaseModes.OFFLINE,
  [PaymentChannels.APP]: PurchaseModes.ONLINE,
};
