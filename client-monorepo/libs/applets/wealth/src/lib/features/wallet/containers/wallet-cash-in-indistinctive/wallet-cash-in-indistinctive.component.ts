import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'wealth-applet-wallet-cash-in-indistinctive',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './wallet-cash-in-indistinctive.component.html',
  styleUrl: './wallet-cash-in-indistinctive.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCashInIndistinctiveComponent implements OnInit {
  navigationService = inject(WealthNavigationService);
  activatedRouter = inject(ActivatedRoute);
  walletId = signal<string | undefined>(undefined);

  ngOnInit() {
    this.walletId.set(this.activatedRouter.snapshot.paramMap.get('id'));
  }

  backToWallet() {
    if (this.walletId()) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
