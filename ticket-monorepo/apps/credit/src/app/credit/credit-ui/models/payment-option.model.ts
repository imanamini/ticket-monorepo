import { PaymentOptionDetail } from './payment-option-detail.model';
import { CreditWallet } from '../../api/purchase/credit-wallet.model';

export type MaxAmountType = 'balance' | 'purchase';
export interface PaymentOption {
  title: string;
  balance: number;
  details: PaymentOptionDetail[];
  id: string;
  creditItem?: CreditWallet;
  color: string;
  disable: boolean;
  maxCreditAmount: number;
  minCreditAmount: number;
  maxAmountType: MaxAmountType;
  installmentCount: number;
}
