import { FundsInvestmentType, FundsType } from '../../components/core/models/fund-schemas';
import { OrderStatus } from '../enums/order-status';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export interface IReceipt {
  uniqueId?: string;
  receiptNumber?: string;
  instrumentName?: string;
  instrumentType?: FundsType;
  investmentType?: FundsInvestmentType;
  status?: OrderStatus;
  transactionType?: TransactionTypeEnum;
  units?: number;
  date?: string;
  time?: string;
  isTradePlaceInternal?: boolean;
  amount?: number;
  paidAmountBreakdown?: IPaidAmountBreakdown;
  ipoDate?: string;
  ipoPaymentMethod?: string;
  confirmationTime?: string;
  confirmationDate?: string;
  walletName?: string;
  requestId?: string;
  trackingCode?: string;
  commission?: string;
}

export interface IPaidAmountBreakdown {
  total?: number;
  wallet?: number;
  ipg?: number;
}

export type ReceiptType = 'error' | 'success' | 'unKnown' | 'waiting';
