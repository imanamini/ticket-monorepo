import { ApiResult } from '../api-result';

export interface BalanceInformationResponseInterface {
  result: ApiResult,
  balance: number,
  cashoutableBalance: number,
  nonCashoutableBalance: number,
  timeBoundBalance: number,
  currency: string
}

export interface GiftCardsResponseInterface {
  result: ApiResult,
  balances: BalancesInterface[]
}

export interface BalancesInterface {
  walletName: string,
  balance: number,
  cashoutableBalance: number,
  nonCashoutableBalance: number,
  currency: string,
  expirationDate?: string
}
