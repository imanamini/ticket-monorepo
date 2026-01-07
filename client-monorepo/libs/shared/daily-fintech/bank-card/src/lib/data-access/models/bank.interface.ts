import { ApiResultInterface } from '@client-monorepo/common/network';

export interface BanksApiResponse {
  result: ApiResultInterface;
  banks: Array<Bank>;
  maxTimeout: number;
}

export interface Bank {
  badge: Badge;
  active: boolean;
  cardPrefixes: Array<string>;
  code: string;
  colorRange: Array<number>;
  imageId: string;
  name: string;
  profileCert: string;
  providerImages: Array<string>;
  uid: string;
  xferCert: string;
  cardTransferMethod: number;
  xferCertFileUrl: string;
  cardBankLogoImageId: string;
  cardImageId: string;
  directDebit: DirectDebit;
  profileCertUrl: string;
  shouldVerify: boolean;
  transferAmountMax: number;
  transferAmountMin: number;
  cardExternalRegistrationMode: number;
}

export interface Badge {
  backgroundColor: string;
  borderColor: string;
  message: string;
  textColor: string;
  value: string;
}

export interface DirectDebit {
  dailyAmountMax: number;
  cardExternalRegistrationMode: number;
}
