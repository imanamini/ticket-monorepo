import { Component, inject } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { COLLATERAL_PAGE_ROUTE_MAP, IProcessData } from '../../data-access/models';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { CollateralService } from '../../data-access/services/collateral.service';

@Component({
  selector: 'wealth-applet-collateral-confirm-info-bottom-sheet',
  standalone: true,
  imports: [NgxButtonComponent, PipesModule, NgxCheckboxComponent],
  templateUrl: './collateral-confirm-info-bottom-sheet.component.html',
  styleUrl: './collateral-confirm-info-bottom-sheet.component.scss',
})
export class CollateralConfirmInfoBottomSheetComponent {
  agreementChecked: boolean;
  isLoading: boolean;
  navigationService = inject(WealthNavigationService);
  data: any;

  private bottomSheet = inject(NgxBottomSheetService);
  private collateralService = inject(CollateralService);

  constructor() {
    this.data = this.bottomSheet.data();
  }

  continue() {
    this.isLoading = true;
    const data: IProcessData = {
      units: this.data.units,
      fullName: this.data.fullName,
    };
    this.collateralService.process(data, this.data.coordinatorAction).subscribe((res) => {
      if (res?.success) {
        const route = COLLATERAL_PAGE_ROUTE_MAP[res.result.data.pageName as string] ?? HOME_ROUTE;
        const state = {
          countDown: res.result.data.countdownInSeconds,
          coordinatorAction: res.result.data.coordinatorAction,
          data: data,
          symbol: this.data.symbol,
        };
        this.navigationService.navigate(route, {
          state,
        });
      }
      this.isLoading = false;
    });
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }

  onToggleAgreement(event: any) {
    this.agreementChecked = event;
  }
}
