import { ICancelBnpl } from './cancel-bnpl.interface';
import { ProcessActionType } from './process-action.type';

export interface IWalletProcessData {
  action?: ProcessActionType;
  data: IProcessData;
}

export interface IProcessData {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nationalId?: string;
  nextAction?: string;

  iban?: string;
  topOnPage?: string;
  cashOutId?: number;

  pageName?: string;
  coordinatorAction?: string;
  instrumentTitle?: string;
  walletAmount?: string;
  phoneNumber?: string;
  message?: string;
  title?: string;
  description?: string;
  walletName?: string;
  maxAmount?: number;
  minAmount?: number;
  countdownInSeconds?: string;

  maxUnits?: number;
  minUnits?: number;
  today?: string;
  instrumentNav?: {
    purchaseNav?: number;
    saleNav?: number;
    statisticNav?: number;
    latestUpdate?: string;
  };

  amount?: string;
  bottomSheetName?: string;
  shebaNumber?: string;
  walletTitle?: string;

  repaymentDate?: string;
  installmentNumber?: string;
  url?: string;
  walletUncollectibleBalance?: number;
  walletWithdrawableBalance?: number;
  cancelResult?: ICancelBnpl;
  agreementChecked?: boolean;
  hasTransactions?: boolean;
  cutoffMessage?: string;
  plans?: IBnplPlan[];
  balance?: number;
  score?: number;
  credit?: number;
  planId?: number;
  unsecureAmount?: number;
  birthDate?: string;
  key?: string;
  confirmedDebtHint?: boolean;
  requireAgreement?: boolean;
  gram?: string;
  hasCommission?: boolean;
  commissionPercentage?: number;
  commission?: number;
  withdrawAmount?: number;
  roundDown?: number;
  minBnplAmount?: number;
  maxBnplAmount?: number;
  bnplAmount?: number;
  rechargeAmount?: number;
  bnplAllocationPercent?: number;
  payableAmount?: number;
  fxBalance?: number;
  goldBalance?: number;
  fxRechargeAmount?: number;
  goldRechargeAmount?: number;
  fxCommission?: number;
  hasFxCommission?: boolean;
  goldCommission?: number;
  hasGoldCommission?: boolean;
  rechargeWallet?: string;
  minAmountInformationMessage?: string;
  maxAmountInformationMessage?: string;
  action?: string;
  weightInGrams?: string;
  shebaNumberId?: number;
  withdrawAll?: boolean;
  walletId?: string;
  postalCode?: string;
  terms?: string;
  skipPostalCodeVerification?: boolean;
  paymentMethod?: string;
}

export interface IBnplPlan {
  credit: number;
  unsecureAmount: number;
  id: number;
  rechargeAmount: number;
}

export interface IWalletProcessState {
  amount: number;
  planId: number;
  credit: number;
  roundDown: number;
  minAmount: number;
  maxAmount: number;
  walletName: string;
  plans: IBnplPlan[];
  minBnplAmount: number;
  bnplAmount: number;
  maxBnplAmount: number;
  unsecureAmount: number;
  rechargeableAmount: number;
  walletWithdrawableBalance: number;
  minAmountInformationMessage: string;
  maxAmountInformationMessage: string;
  confirmedDebtHint: boolean;
  requireAgreement: boolean;
  skipPostalCodeVerification: boolean;
}

export interface IWalletDeposit {
  landing: string;
  pageName: string;
  minAmount: number;
  maxAmount: number;
  walletName: string;
  walletTitle: string;
  hasTransactions: boolean;
  requireAgreement: boolean;
  walletWithdrawableBalance: number;
  walletUncollectibleBalance: number;
}
