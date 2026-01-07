import { CardZonesEnum } from '@client-monorepo/daily-fintech/bank-card';

export enum ShaparakTypes {
  REGISTER = 0,
  EXPIRATION_DATE = 1,
}

export enum ConfirmShaparakStatus {
  IGNORED = 'ignored',
  FAILED = 'failed',
  CANCELLED = 'canceled',
}

export interface ShaparakConfig {
  description: string;
  redirectUrl: string;
  forcible: boolean;
  callbackUrl: string;
}

export interface ShaparakCardInfo {
  bankName: string;
  bankLogo: string;
  pan: string;
  cardHolder: string;
  cardExternalRegistrationMode: number;
  cardZones?: CardZonesEnum[];
}
