import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'wallet-mng-applet-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonsComponent {
  private router = inject(Router);
  private gtmWallet = inject(WalletGtmService);


  public navigateToIncreaseWithdrawal(): void {
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.WALLET_MNG_CASHIN);
    this.router.navigate(['/cash-in']);
  }

  public navigateToWalletTransfer(): void {
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.WALLET_MNG_CASHOUT);
    this.router.navigate(['/cash-out']);
  }
}