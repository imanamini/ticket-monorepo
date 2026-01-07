import { ProcessActionType } from '../../wallet/models/process-action.type';
import { EWalletActivation } from './wallet-activation.enum';

export interface ISwapProcess {
  action: string;
  data: ISwapProcessData;
}

export interface ISwapProcessData {
  wallets: ISwapWallet[];
  coordinatorAction: string;
  pageName: string;
  topOnPage: string;
  walletId: string;
  bnplAmount: number;
  message?: string;
  current?: ISwapChangeDetail[];
  subsequent?: ISwapChangeDetail[];
  source?: string;
  destination?: string;
}

export interface ISwapWallet {
  walletId: number;
  policyId: number;
  minAmount: number;
  maxAmount: number;
  walletTotal: number;
  withdrawableBalance: number;
  commissionPercentage: number;
  uncollectibleBalance: number;
  walletSwapableBalance: number;
  walletName: string;
  walletTitle: string;
  hasCommission: boolean;
  requireAgreement: boolean;
  activationRequired: boolean;
  isOrigin: boolean;
  status: EWalletActivation;
}

export interface ISwapDto {
  amount?: number;
  walletId?: string;
  source?: string;
  destination?: string;
  action?: ProcessActionType;
  activeSwap?: boolean;
  swapAllAmount?: boolean;
}

export interface ISwapChangeDetail {
  walletName: string;
  walletTitle: string;
  uncollectibleBalance: number;
  withdrawableBalance: number;
  total?: number;
}
