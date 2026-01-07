import { NgxAlert } from '@digipay/ngx-alert';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { ECreditStatus } from '../../models/credit-status.enum';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { WalletCreditDetailComponent } from './components/wallet-credit-detail/wallet-credit-detail.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'wealth-applet-wallet-credit',
  standalone: true,
  imports: [NgxButtonComponent, WalletCreditDetailComponent, NgxAlert, NgxDividerComponent],
  templateUrl: './wallet-credit.component.html',
  styleUrl: './wallet-credit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCreditComponent implements OnInit {
  walletName = input<string>();
  walletTitle = input<string>();
  creditStatus = ECreditStatus;
  creditAmount = input<number>();
  creditStatusEnum = input<ECreditStatus>();
  walletId = signal<string | undefined>(undefined);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  handleBnplClicked = output();

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  handleBnpl() {
    this.handleBnplClicked.emit();
  }

  redirectHandler(name: string) {
    if (name === 'credit') {
      this.router.navigateByUrl('service/bnpl/overview');
    }
  }
}
