import { inject, Injectable } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PortfolioDetail } from '../../../data-access/models/portfolio-detail.model';
import { CROWD_LIST_ROUTE, INVESTMENT_LIST_ROUTE, WALLETS_ROUTE } from '../../../data-access/constants/app-routes';

@Injectable({
  providedIn: 'root',
})
export class NavigationToDetail {
  private navigationService = inject(WealthNavigationService);

  goToDetail(item: PortfolioDetail) {
    switch (item.investmentType) {
      case 'CrowdFund':
        this.navigationService.navigate([CROWD_LIST_ROUTE, item.symbol]);
        break;
      case 'ETF':
        this.navigationService.navigate([INVESTMENT_LIST_ROUTE, item.symbol]);
        break;
      case 'Wallet':
        this.navigationService.navigate([WALLETS_ROUTE, item.symbol.toLowerCase()]);
        break;
      default:
        this.navigationService.navigate([INVESTMENT_LIST_ROUTE, item.symbol]);
        break;
    }
  }
}
