import { Component, inject, input } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { COLLATERAL_PAGE_ROUTE_MAP, ECollateralRequestStatus } from '../../data-access/models';
import { IProcessData } from '../../data-access/models';
import { NgClass } from '@angular/common';
import { CollateralService } from '../../data-access/services/collateral.service';

@Component({
  selector: 'wealth-applet-collateral-touch-point',
  standalone: true,
  imports: [NgxButtonComponent, NgClass],
  templateUrl: './collateral-touch-point.component.html',
  styleUrl: './collateral-touch-point.component.scss',
})
export class CollateralTouchPointComponent {
  title = input<string>();
  description = input<string>();
  symbol = input<string>();
  state = input<ECollateralRequestStatus>();

  resutlState = ECollateralRequestStatus;

  navigationService = inject(WealthNavigationService);

  constructor(private collateralService: CollateralService) {}

  navigateToCollateral() {
    const data: IProcessData = {
      instrumentSymbol: this.symbol(),
      action: 'start_journey',
    };
    this.collateralService.process(data).subscribe((res) => {
      if (res?.success) {
        const route = COLLATERAL_PAGE_ROUTE_MAP[res.result.data.pageName as string] ?? HOME_ROUTE;
        const routeParam = res.result.data.pageName === 'page_collateral_landing' ? this.symbol() : null;
        const state = {
          symbol: this.symbol(),
          instrumentTitle: res.result.data.instrumentTitle,
          collateralAmount: res.result.data.collateralAmount,
          coordinatorAction: res.result.data.coordinatorAction,
        };
        this.navigationService.navigate([route, routeParam], {
          state,
        });
      }
    });
  }
}
