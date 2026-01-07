import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IProcessData } from '../../models/wallet-process.interface';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-cutoff',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxButtonComponent],
  templateUrl: './wallet-cutoff.component.html',
  styleUrl: './wallet-cutoff.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCutoffComponent implements OnInit {
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);

  private activatedRoute = inject(ActivatedRoute);
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));

    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }
}
