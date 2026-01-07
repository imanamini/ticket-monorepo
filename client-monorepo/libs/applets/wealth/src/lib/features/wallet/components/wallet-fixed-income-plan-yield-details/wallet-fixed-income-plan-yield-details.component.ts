import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryProfitComponent } from '../inventory-profit/inventory-profit.component';
import { AnnualProfitComponent } from '../annual-profit/annual-profit.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { EWalletProfit, IWallet } from '../../models/wallet.interface';
import { IAnnualProfit } from '../../models/annual-profit.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLET_ANNUAL_PROFIT_ROUTE } from '../../../../data-access/constants/app-routes';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'wealth-applet-wallet-fixed-income-plan-yield-details',
  standalone: true,
  imports: [CommonModule, InventoryProfitComponent, AnnualProfitComponent, NgxDividerComponent, PipesModule],
  templateUrl: './wallet-fixed-income-plan-yield-details.component.html',
  styleUrl: './wallet-fixed-income-plan-yield-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletFixedIncomePlanYieldDetailsComponent {
  wallet = input.required<IWallet>();
  skeleton = input.required<boolean>();
  annualProfit = input<IAnnualProfit>();

  private navigationService = inject(WealthNavigationService);

  protected readonly EPnlView = EWalletProfit;
  protected readonly BorderColorsEnum = BorderColorsEnum;

  allPnls() {
    this.navigationService.navigate([WALLET_ANNUAL_PROFIT_ROUTE, this.wallet().walletName.toLowerCase()], {
      queryParams: {
        loadAll: true,
      },
      state: this.wallet().profit,
    });
  }
}
