import { NgxBadgeModule } from '@digipay/ngx-badge';
import { Component, inject, input, signal } from '@angular/core';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { DashboardCategory } from '../../../../data-access/models/dashboard-parts.model';

@Component({
  selector: 'wealth-applet-home-categories',
  standalone: true,
  imports: [NgxBadgeModule],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.scss',
})
export class HomeCategoriesComponent {
  categories = input<DashboardCategory[]>();
  treasuryIconPath = signal('wealth-assets/images/treasury-wallet.png');

  private navigationService = inject(WealthNavigationService);

  openFunds(category: DashboardCategory) {
    if (category.path) {
      this.navigationService.navigate([category.path], {
        queryParams: { type: category.query },
      });
    }
  }

  redirectToWallet() {
    this.navigationService.navigate([WALLETS_ROUTE, 'treasury'], {
      queryParams: {
        referrer: 'wealth',
      },
    });
  }
}
