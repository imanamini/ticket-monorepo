import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'wealth-applet-wallet-bnpl-request-failure',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxButtonComponent],
  templateUrl: './wallet-bnpl-request-failure.component.html',
  styleUrl: './wallet-bnpl-request-failure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplRequestFailureComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.activatedRoute.snapshot.paramMap.get('id')]);
  }

  PaymentOfInstallments() {
    const source_url = encodeURIComponent('/mini-app/wealth/wallets/treasury');
    this.router.navigateByUrl(`/service/credit/installments-overview?serviceType=bnpl&rfr=wlth&${source_url}`);
  }
}
