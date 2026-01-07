import { TransactionTypeGroupInterface } from '../models/transaction-type-group.interface';
import { TransactionType } from '../models/transaction-type.enum';
import { TransactionTypeGroupsNamesEnum } from '../models/transaction-type-groups-names.enum';

export const allTransactionsGroup: Array<TransactionTypeGroupInterface> = [
  {
    name: TransactionTypeGroupsNamesEnum.C2C,
    types: [TransactionType.CARD],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.CHARGE,
    types: [TransactionType.TOP_UP, TransactionType.INTERNET_PACKAGE],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.BILL,
    types: [TransactionType.UTILITY_BILL, TransactionType.TOLL_PAYOFF, TransactionType.CONGESTION_PRICING],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.FINE,
    types: [TransactionType.TRAFFIC_FINE, TransactionType.TRAFFIC_FINE_INQUIRY],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.TOLL,
    types: [TransactionType.TOLL_PAYOFF],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.DONATION,
    types: [TransactionType.DONATION],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.WALLET,
    types: [
      TransactionType.REWARD,
      TransactionType.PAYMENT_OFFLINE,
      TransactionType.WALLET,
      TransactionType.CASH_IN,
      TransactionType.CASH_OUT,
    ],
    type: 'both',
  },
  {
    name: TransactionTypeGroupsNamesEnum.PURCHASE,
    types: [TransactionType.PURCHASE, TransactionType.CREDIT_PURCHASE, TransactionType.MARKETPLACE, TransactionType.APP_SUBSCRIPTION],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.INVEST,
    types: [TransactionType.STOCK],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.LOAN,
    types: [
      TransactionType.INSTALLMENT,
      TransactionType.CREDIT_EARLY_SETTLEMENT,
      TransactionType.CREDIT_PREPAYMENT,
      TransactionType.MERCHANT_CREDIT_SETTLEMENT_FEE,
      TransactionType.DIGITAL_SIGNATURE,
      TransactionType.CREDIT_RESIDUE,
      TransactionType.CREDIT_FILING,
      TransactionType.CREDIT_ALLOCATION_PREPAYMENT,
      TransactionType.REVOLVING,
      TransactionType.PROMISSORY_NOTE,
      TransactionType.MERCHANT_CREDIT_REGISTRATION,
      TransactionType.CREDIT_PURCHASE,
    ],
    type: 'both',
  },
  {
    name: TransactionTypeGroupsNamesEnum.REWARD,
    types: [TransactionType.VOUCHER, TransactionType.REWARD],
    type: 'income',
  },
  {
    name: TransactionTypeGroupsNamesEnum.REFUND,
    types: [TransactionType.REFUND, TransactionType.REFUND_MANUAL, TransactionType.REFUND_DIGIPAY],
    type: 'income',
  },
  {
    name: TransactionTypeGroupsNamesEnum.INSTALLMENT,
    types: [TransactionType.INSTALLMENT, TransactionType.CREDIT_EARLY_SETTLEMENT],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.TAXI,
    types: [TransactionType.TAXI_PAYMENT],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesEnum.Wealth,
    types: [TransactionType.WEALTH_CASH_IN, TransactionType.WEALTH_CASH_OUT],
    type: 'both',
  },
];
