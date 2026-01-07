import { OrderStatus } from '../enums/order-status';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export interface Transaction {
  transaction?: string;
  creationDate?: string;
  creationTime?: string;
  instrumentName?: string;
  instrumentType?: string;
  instrumentOrderId?: number;
  orderAmount?: number;
  orderDate?: string;
  orderPaymentTypeId?: number;
  orderPaymentTypeName?: string;
  receiptNumber?: string;
  statusId?: number;
  statusName?: string;
  unit?: number;
  instrumentLogoAddress?: string;
  isTradePlaceInternal?: boolean;
  uniqueId?: string;
  remoteOrderId?: string;
  transactionTypeEnum?: TransactionTypeEnum;
}

export interface ITransaction_V2 {
  amount: number;
  date: string;
  icon: string;
  status: OrderStatus;
  title: string;
  type: TransactionTypeEnum;
  uniqueId: number;
  units: number;
  instrumentSymbol: string;
  instrumentInvestmentType?: string;
  instrumentDisplaySymbol?: string;
  instrumentType?: string;
}
