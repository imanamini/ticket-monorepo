import { Component, inject, OnInit } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { BnplBannerComponent } from '../../../../shared/components/bnpl-banner/bnpl-banner/bnpl-banner.component';
import { Router } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'wealth-applet-collateral-approved-result',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, BnplBannerComponent, SpinnerComponent],
  templateUrl: './collateral-approved-result.component.html',
  styleUrl: './collateral-approved-result.component.scss',
})
export class CollateralApprovedResultComponent implements OnInit {
  isLoading = false;
  state: {
    symbol: string;
    instrumentTitle: string;
    collateralAmount: string;
  };

  private router = inject(Router);
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state = this.routeState.getAll();
  }

  continue(type: 'bnpl' | 'store') {
    if (type === 'store') {
      this.router.navigateByUrl('/stores/all-stores?sort=priority&paymentMethods=2');
    } else {
      this.router.navigateByUrl('/service/bnpl/overview');
    }
  }

  onBackHandler() {
    if (this.state?.symbol) {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.state?.symbol]);
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }
}
