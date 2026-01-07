import { ActionType, RedirectAction } from '@client-monorepo/common/action-handler';

export function supperAppTransaction() {
  const action: RedirectAction = {
    type: ActionType.REDIRECT,
    payload: {
      url: 'transactions/report/history',
      state: { customLinkForBack: `mini-app/wealth/wallets/${this.walletId()}?referrer=wealth` },
      params: { type: '72,73' },
    },
  };
  this.actionHandlerService.handle(action);
}
