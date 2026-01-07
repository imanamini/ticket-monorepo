import { ECreditStatus } from './credit-status.enum';

export type TCompleteRegistrationHint = 'None' | 'InCompleterRegistration' | 'PendingForPostalCodeVerification';
export interface IWallets {
  id: string;
  title: string;
  totalBalance: number;
  hasTransactions: boolean;
  bnpl: IWalletBnpl;
  postalCode?: string;
  onBoarded: boolean;
  wallets: IWallet[];
  hasAffiliateCode: boolean;
  swapEnabled: boolean;
}

export interface IWallet {
  title: string;
  balance: number;
  withdrawalBalance: number;
  uncollectibleBalance: number;
  walletName: string;
  walletLogo: string;
  hasTransactions: boolean;
  hasPendingTrade: boolean;
  profit: IWalletProfit;
  postalCode?: string;
  completeRegistrationHint: TCompleteRegistrationHint | string;
  bnplDescriptions?: string;
  weightInGrams?: number;
  indexValue?: number;
}

export interface IWalletBnpl {
  status: ECreditStatus;
  amount: number;
  minAmount: number;
  roundDown: number;
}
export interface IWalletProfit {
  status?: EWalletProfit;
  totalProfit?: number;
  dailyPercentage?: string;
  totalPercentage?: number;
  percentage?: number;
  changePercent?: number;
  pageSize?: number;
}

export enum EWalletProfit {
  NoProfit = 'NoProfit',
  NoProfitInFourMonth = 'NoProfitInFourMonth',
  Profit = 'Profit',
}
