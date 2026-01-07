import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { BnplBannerComponent } from '../../../../shared/components/bnpl-banner/bnpl-banner/bnpl-banner.component';
import { IProcessData } from '../../models/wallet-process.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ECreditStatus } from '../../models/credit-status.enum';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'wealth-applet-wallet-bnpl-detail',
  standalone: true,
  imports: [NgxAppBarComponent, BnplBannerComponent, NgxButtonComponent, PipesModule],
  templateUrl: './wallet-bnpl-detail.component.html',
  styleUrl: './wallet-bnpl-detail.component.scss',
})
export class WalletBnplDetailComponent implements OnInit {
  walletId = signal<string | undefined>(undefined);
  state = signal<IProcessData | undefined>(undefined);
  amount = signal<string | undefined>(undefined);
  trackingCode = signal<string | undefined>(undefined);

  private pipesModule = new SeparateThousandsPipe();
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly ECreditStatus = ECreditStatus;
  private navigationService = inject(WealthNavigationService);

  bnplTitle = computed(() => {
    return `<span class='text-onback-high st-7'> ${this.pipesModule.transform(this.amount())} </span> <span class='text-onback-medium c-1'> ریال اعتبار 4 قسطه </span>`;
  });

  bnplDescription = computed(() => {
    return `<span class='l-1 text-onback-high'>بازپرداخت هر قسط:</span> <span class='l-2 text-onback-medium'> یکم تا پنجم ماه </span>`;
  });

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.trackingCode.set(this.activatedRoute.snapshot.queryParams['trackingCode']);
    this.state.set(this.routeState.getAll());
    console.log(this.state());

    this.amount.set(this.state()?.amount || this.activatedRoute.snapshot.queryParams['amount']);
    if (!this.state()?.walletName) {
      this.onBackHandler();
    }
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }
}
