import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { Buttons, NgxStatusResultModule } from '@digipay/ngx-status-result';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'wealth-applet-withdraw-from-gold-wallet-pending',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxStatusResultModule],
  templateUrl: './withdraw-from-gold-wallet-pending.component.html',
  styleUrl: './withdraw-from-gold-wallet-pending.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawFromGoldWalletPendingComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  walletId = signal<string | undefined>(undefined);
  buttons = signal<Buttons[]>([
    {
      id: 'primary',
      label: 'متوجه شدم',
      style: 'fill',
      mode: 'section',
      fullWidth: false,
    },
  ]);

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }
}
