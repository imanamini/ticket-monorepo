import { TransactionTypeGroupInterface } from '@client-monorepo/payment/transactions';
import { TransactionType } from '../models/transaction-type.enum';
import { TransactionTypeGroupsNamesPillarEnum } from '../models/transaction-type-groups-names-pillar.enum';

export const pillarTransactionsGroup: Array<TransactionTypeGroupInterface> = [
  {
    name: TransactionTypeGroupsNamesPillarEnum.WALLET,
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
    name: TransactionTypeGroupsNamesPillarEnum.PURCHASE,
    types: [TransactionType.PURCHASE, TransactionType.CREDIT_PURCHASE, TransactionType.MARKETPLACE, TransactionType.APP_SUBSCRIPTION],
    type: 'expense',
  },
  {
    name: TransactionTypeGroupsNamesPillarEnum.LOAN,
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
    name: TransactionTypeGroupsNamesPillarEnum.REFUND,
    types: [TransactionType.REFUND, TransactionType.REFUND_MANUAL, TransactionType.REFUND_DIGIPAY],
    type: 'income',
  },
  {
    name: TransactionTypeGroupsNamesPillarEnum.INSTALLMENT,
    types: [TransactionType.INSTALLMENT, TransactionType.CREDIT_EARLY_SETTLEMENT],
    type: 'expense',
  },
];
