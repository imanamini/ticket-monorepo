import { inject } from '@angular/core';
import { WALLETS_ROUTE, RESULT_ROUTE, HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { IProcessData } from '../../models/wallet-process.interface';
import { WALLET_PAGE_ROUTE_MAP } from '../models/wallet-pages-map';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PaymentProcess } from '../../../../shared/services/payment/helpers/payment-process';

const receiptRoutes = ['page_wallet_cach_out_receipt', 'page_wallet_withdraw_gold_receipt', 'page_wallet_withdraw_fx_receipt'];
const routesWithoutParams = ['page_global_customer_death', 'page_global_national_id'];

export class RedirectionHandler {
  private navigationService = inject(WealthNavigationService);
  private paymentProcess = inject(PaymentProcess);

  HandleWalletPageRedirection(page: string, state: IProcessData, walletId: string) {
    if (state.url) {
      const symbol = walletId || state.walletName;
      if (symbol?.toLowerCase() === 'treasury') {
        this.navigationService.navigate([WALLETS_ROUTE, symbol], { replaceUrl: true }).then(() => {
          this.paymentProcess.openIPG(state.url);
        });
      } else {
        this.navigationService
          .navigate([RESULT_ROUTE], {
            queryParams: {
              incomplete: 'true',
              instrumentSymbol: symbol,
            },
            replaceUrl: true,
          })
          .then(() => {
            this.paymentProcess.openIPG(state.url);
          });
      }
    } else {
      this._handleWalletNavigation(page, state, walletId);
    }
  }

  private _handleWalletNavigation(page: string, state: IProcessData, walletId: string) {
    const route = WALLET_PAGE_ROUTE_MAP[page as string] ?? HOME_ROUTE;
    const navigationCommands = walletId && ![...receiptRoutes, ...routesWithoutParams].includes(page) ? [route, walletId] : [route];
    const recieptPageQueryParams = receiptRoutes.includes(page)
      ? {
          trackingCode: state.cashOutId,
          walletAction: 'cashOut',
        }
      : {};
    this.navigationService.navigate(navigationCommands, {
      queryParams: recieptPageQueryParams,
      state,
    });
  }
}
