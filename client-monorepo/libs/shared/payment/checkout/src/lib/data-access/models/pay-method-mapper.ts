import { APP_ACTIONS } from '@client-monorepo/common/action-handler';

export const PayMethodMapper: Record<number, string> = {
  [APP_ACTIONS.PAYMENT_IPG]: 'IPG',
  [APP_ACTIONS.PAYMENT_BPG_1PAY]: '1PAY',
  [APP_ACTIONS.PAYMENT_BPG_4PAY]: '4PAY',
  [APP_ACTIONS.PAYMENT_WALLET]: 'WALLET',
  [APP_ACTIONS.WALLET_CASH_IN_IPG]: 'CASH_IN_PAY',
};
