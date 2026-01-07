import { inject } from '@angular/core';
import { ISwapProcessData, SWAP_PAGES_ROUTE_MAP } from '../models';
import { WALLETS_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

export class SwapPageRedirection {
  private navigationService = inject(WealthNavigationService);

  redirect(page: string, state: ISwapProcessData, walletId: string) {
    const route = SWAP_PAGES_ROUTE_MAP[page as string] ?? WALLETS_ROUTE;
    this.navigationService.navigate([route, walletId], {
      state,
    });
  }
}
