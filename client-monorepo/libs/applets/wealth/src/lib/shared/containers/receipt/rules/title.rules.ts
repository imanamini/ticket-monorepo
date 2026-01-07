import { receiptCommonRules } from './common.rules';
import { IReceipt, ReceiptType } from '../../../../data-access/models/receipt.interface';

type TitleRule = {
  when: (r: IReceipt) => boolean;
  text: (r: IReceipt) => string;
  result: (r: IReceipt) => ReceiptType;
};

const rules: TitleRule[] = [
  // Profit / Overplus: Short-circuit
  {
    ...receiptCommonRules.profitWaiting,
    result: () => 'waiting',
  },
  {
    ...receiptCommonRules.profitSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.overplusWaiting,
    result: () => 'waiting',
  },
  {
    ...receiptCommonRules.overplusSuccess,
    result: () => 'success',
  },

  // Draft/Waiting
  {
    ...receiptCommonRules.buyWaiting,
    result: () => 'waiting',
  },
  {
    ...receiptCommonRules.sellWaiting,
    result: () => 'waiting',
  },
  {
    ...receiptCommonRules.walletWithdrawWaiting,
    result: () => 'waiting',
  },
  {
    ...receiptCommonRules.buyIpoWaiting,
    result: () => 'waiting',
  },

  // Rejected by Manager/System
  {
    ...receiptCommonRules.ipoRejected,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.buyRejected,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.sellRejected,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.sellRejected,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.walletWithdrawRejected,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.buyRejectedManager,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.sellRejectedManager,
    result: () => 'error',
  },

  // Approved/Success
  {
    ...receiptCommonRules.buyIpoSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.walletWithdrawSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.walletDepositSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.buySuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.sellSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.depositSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.withdrawSuccess,
    result: () => 'success',
  },

  // Failed/Rejected/Completed/Requested/InProgress
  {
    ...receiptCommonRules.depositFailed,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.withDrawFailed,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.withdrawWaiting,
    result: () => 'waiting',
  },

  // Deleted
  {
    ...receiptCommonRules.buyIpoDeleted,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.buyDeleted,
    result: () => 'error',
  },
  {
    ...receiptCommonRules.sellDeleted,
    result: () => 'error',
  },

  //   // SELL ETF
  {
    ...receiptCommonRules.sellETFSuccess,
    result: () => 'success',
  },
  {
    ...receiptCommonRules.sellETFWaiting,
    result: () => 'waiting',
  },
];

export function getReceiptInfo(r: IReceipt): { text: string; result: ReceiptType } {
  const rule = rules.find((x) => x.when(r));
  return rule ? { text: rule.text(r), result: rule.result(r) } : { text: 'وضعیت نامشخص', result: 'unKnown' };
}
