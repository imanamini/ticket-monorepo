import { CommonModule } from '@angular/common';
import { IAnnualProfit } from '../../models/annual-profit.interface';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AnnualProfitComponent } from '../../components/annual-profit/annual-profit.component';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ActivatedRoute } from '@angular/router';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { EWalletProfit, IWalletProfit } from '../../models/wallet.interface';
import { WalletService } from '../../services/wallet.service';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ProfitService } from '../../../../components/core/services/v1/profit.service';
@Component({
  selector: 'wealth-applet-wallet-annual-profit',
  standalone: true,
  imports: [CommonModule, AnnualProfitComponent, AppBarWrapperComponent, PipesModule],
  templateUrl: './wallet-annual-profit.component.html',
  styleUrl: './wallet-annual-profit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletAnnualProfitComponent implements OnInit {
  skeleton = signal<boolean>(true);
  walletId = signal<string | undefined>(undefined);
  state = signal<IWalletProfit | undefined>(undefined);
  annualProfit = signal<IAnnualProfit | undefined>(undefined);
  private profitService = inject(ProfitService);

  private walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getProfit();
  }

  private getProfit() {
    this.profitService.getProfit(this.state().pageSize).subscribe((res) => {
      if (res.success) {
        this.annualProfit.set(res.result);
      }
      this.skeleton.set(false);
    });
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }
}
