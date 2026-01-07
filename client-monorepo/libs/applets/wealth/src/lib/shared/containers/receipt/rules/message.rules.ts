import { receiptCommonRules } from './common.rules';
import { IReceipt } from '../../../../data-access/models/receipt.interface';

type MsgRule = { when: (r: IReceipt) => boolean; text: (r: IReceipt) => string };

const rules: MsgRule[] = [
  // Profit / Overplus: Short-circuit
  {
    ...receiptCommonRules.profitWaiting,
  },
  {
    ...receiptCommonRules.profitSuccess,
  },
  {
    ...receiptCommonRules.overplusWaiting,
  },
  {
    ...receiptCommonRules.overplusSuccess,
  },

  // Draft/Waiting
  {
    ...receiptCommonRules.buyWaiting,
  },
  {
    ...receiptCommonRules.sellWaiting,
  },
  {
    ...receiptCommonRules.walletWithdrawWaiting,
  },
  {
    ...receiptCommonRules.buyIpoWaiting,
  },

  // Rejected by Manager/System
  {
    ...receiptCommonRules.ipoRejected,
  },
  {
    ...receiptCommonRules.buyRejected,
  },
  {
    ...receiptCommonRules.sellRejected,
  },
  {
    ...receiptCommonRules.sellRejected,
  },
  {
    ...receiptCommonRules.walletWithdrawRejected,
  },
  {
    ...receiptCommonRules.buyRejectedManager,
  },
  {
    ...receiptCommonRules.sellRejectedManager,
  },

  // Approved/Success
  {
    ...receiptCommonRules.buyIpoSuccess,
  },
  {
    ...receiptCommonRules.walletWithdrawSuccess,
  },
  {
    ...receiptCommonRules.walletDepositSuccess,
  },
  {
    ...receiptCommonRules.buySuccess,
  },
  {
    ...receiptCommonRules.sellSuccess,
  },
  {
    ...receiptCommonRules.depositSuccess,
  },
  {
    ...receiptCommonRules.withdrawSuccess,
  },

  // Failed/Rejected/Completed/Requested/InProgress
  {
    ...receiptCommonRules.depositFailed,
  },
  {
    ...receiptCommonRules.withDrawFailed,
  },
  {
    ...receiptCommonRules.withdrawWaiting,
  },

  // Deleted
  {
    ...receiptCommonRules.buyIpoDeleted,
  },
  {
    ...receiptCommonRules.buyDeleted,
  },
  {
    ...receiptCommonRules.sellDeleted,
  },

  //   // SELL ETF
  {
    ...receiptCommonRules.sellETFSuccess,
  },
  {
    ...receiptCommonRules.sellETFWaiting,
  },
];

export function getMessage(r: IReceipt): string {
  const rule = rules.find((x) => x.when(r));
  return rule ? rule.text(r) : '';
}
