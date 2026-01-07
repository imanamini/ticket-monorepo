export interface PaymentFeature {
  callbackFeature: PaymentFeature;
  description: string;
  icon: string;
  isPreferredGateway: boolean;
  name: FeatureCodes;
  order: number;
  preferred: boolean;
  protectionState: number;
  selectedColor: string;
  selectedIcon: string;
  status: number;
  title: string;
  transactionType: PaymentType;
  visible: boolean;
}

export enum PaymentType {
  INQUIRY_FINE_PAYMENT = 45,
  FINE_PAYMENT = 31,
  CASH_IN = 14,
}

export enum FeatureCodes {
  WALLET = '0',
  IPG = '2',
  WALLET_CASH_IN = '253',
}
