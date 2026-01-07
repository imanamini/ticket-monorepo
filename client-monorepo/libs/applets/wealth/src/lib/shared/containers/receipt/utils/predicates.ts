import { OrderStatus } from '../../../../data-access/enums/order-status';
import { TransactionTypeEnum } from '../../../../data-access/enums/transaction-type.enum';
import { IReceipt } from '../../../../data-access/models/receipt.interface';

export const isIPO = (r: IReceipt) => r.instrumentType === 'IPO';
export const isETF = (r: IReceipt) => r.investmentType === 'ETF';
export const isCrowd = (r: IReceipt) => r.investmentType === 'CrowdFund';

export const isPending = (r: IReceipt) => r.status === OrderStatus.InProgress || r.status === OrderStatus.Draft;
export const isBuy = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Buy;
export const isSell = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Sell;
export const isWithdraw = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Withdrawal;
export const isDeposit = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Deposit;
export const isWalletDeposit = (r: IReceipt) => r.transactionType === TransactionTypeEnum.EtfWalletDeposit;
export const isWalletWithdraw = (r: IReceipt) => r.transactionType === TransactionTypeEnum.EtfWalletWithdrawal;
export const isProfit = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Profit;
export const isOverplus = (r: IReceipt) => r.transactionType === TransactionTypeEnum.Overplus;
export const isProfitOrOverplus = (r: IReceipt) =>
  r.transactionType === TransactionTypeEnum.Profit || r.transactionType === TransactionTypeEnum.Overplus;

export const hasStatus = (r: IReceipt, ...s: OrderStatus[]) => s.includes(r.status);
