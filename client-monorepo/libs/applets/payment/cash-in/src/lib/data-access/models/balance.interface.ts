import { ApiResultInterface } from '@client-monorepo/common/network';

export interface BalanceInformationForPreview {
  balance?: number;
  cashoutableBalance: number;
  nonCashoutableBalance: number;
  timeBoundBalance: number;
}

export interface BalanceInformationResponseInterface {
  result: ApiResultInterface;
  balance: number;
  cashoutableBalance: number;
  nonCashoutableBalance: number;
  timeBoundBalance: number;
  currency: string;
  blockedBalance: number;
}

export interface GiftCardsResponseInterface {
  result: ApiResultInterface;
  balances: BalancesInterface[];
}

export interface BalancesInterface {
  walletName: string;
  balance: number;
  cashoutableBalance: number;
  nonCashoutableBalance: number;
  currency: string;
  expirationDate?: string;
}
