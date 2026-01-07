import { ISwapDto } from '../../swap/models';
import { ProcessActionType } from './process-action.type';

export interface IWalletProcess {
  walletName: string;
  terms?: string;
  amount?: string;
  walletId?: string;
  birthDate?: string;
  action?: ProcessActionType;
  walletTitle?: string;
  shebaNumber?: string;
  nationalId?: string;
  postalCode?: string;
  phoneNumber?: string;
  walletUncollectibleBalance?: number;
  walletWithdrawableBalance?: number;
  minAmount?: number;
  maxAmount?: number;
  planId?: number;
  confirmedDebtHint?: boolean;
  skipPostalCodeVerification?: boolean;
  weightInGrams?: string;
  rechargeWallet?: string;
  paymentMethod?: string;
  shebaNumberId?: number;
  processData?: ISwapDto;
  withdrawAll?: boolean;
  commissionPercentage?: number;
  hasCommission?: boolean;
  activeSwap?: boolean;
}
