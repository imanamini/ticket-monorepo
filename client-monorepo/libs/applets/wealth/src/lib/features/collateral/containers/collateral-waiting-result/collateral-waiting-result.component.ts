import { Component, inject, OnInit } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';

@Component({
  selector: 'wealth-applet-collateral-waiting-result',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent],
  templateUrl: './collateral-waiting-result.component.html',
  styleUrl: './collateral-waiting-result.component.scss',
})
export class CollateralWaitingResultComponent implements OnInit {
  navigationService = inject(WealthNavigationService);
  state: any;

  private routeState = inject(RouteStateService);

  ngOnInit(): void {
    this.state = this.routeState.getAll();
  }

  continue() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  onBackHandler() {
    if (this.state?.symbol) {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.state?.symbol]);
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }
}
