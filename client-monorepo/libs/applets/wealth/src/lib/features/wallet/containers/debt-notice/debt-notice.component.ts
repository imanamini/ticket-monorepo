import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import {
  WALLET_BNPL_RECHARGE,
  WALLET_FX_BNPL,
  WALLET_GOLD_BNPL,
  WALLET_MIX_BNPL,
  WALLETS_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { WalletService } from '../../services/wallet.service';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { RouteStateService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'wealth-applet-debt-notice',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxIcon, NgxButtonComponent],
  templateUrl: './debt-notice.component.html',
  styleUrl: './debt-notice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtNoticeComponent implements OnInit {
  private walletId = signal<string | undefined>(undefined);

  private state = signal<IProcessData | undefined>(undefined);
  private router = inject(Router);
  private walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.state.set(this.routeState.getAll());
    if (!this.state()?.walletName) {
      this.onBackHandler();
    }
  }

  onBackHandler() {
    let route = WALLETS_ROUTE;
    switch (this.state().walletName) {
      case 'WALLET_FX':
        route = WALLET_FX_BNPL;
        break;
      case 'WALLET_GOLD':
        route = WALLET_GOLD_BNPL;
        break;
      case 'WALLET_MIX':
        route = this.state().rechargeAmount > 0 || this.state().rechargeWallet ? WALLET_BNPL_RECHARGE : WALLET_MIX_BNPL;
        break;
      default:
        route = WALLETS_ROUTE;
        break;
    }
    this.navigationService.navigate([route, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  redirectToBnplInstallments() {
    const source_url = encodeURIComponent('/mini-app/wealth/wallets/treasury');
    this.router.navigateByUrl(`/service/credit/installments-overview?serviceType=bnpl&rfr=wlth&source-url=${source_url}`);
  }

  closeAndContinue() {
    const processData: IWalletProcessData = {
      action: 'confirmed_debt_hint',
      data: {
        walletId: this.walletId(),
        walletName: this.state().walletName,
        amount: this.state().amount,
        confirmedDebtHint: true,
        ...(this.state()?.rechargeWallet ? { rechargeWallet: this.state()?.rechargeWallet } : {}),
      },
    };
    this.walletService.walletProcess(WALLET_COORDINATOR_PROCESS_API, processData).subscribe();
  }
}
