import { IQuickPaymentState } from '../../quick-payment/models';

export interface IDepositReview {
  amount: string;
  notes?: string[];
  walletName: string;
  walletId: string;
  walletTitle: string;
  hasCommission?: boolean;
  commission?: number;
  payableAmount?: number;
  methods?: IQuickPaymentState[];
}
