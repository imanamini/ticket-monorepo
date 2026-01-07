import { NgClass } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Component, inject, input } from '@angular/core';
import { CASHIN_ROUTE, CASHOUT_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'app-portfo-etf',
  standalone: true,
  imports: [NgxIcon, NgClass, PipesModule, NgxAlert],
  templateUrl: './portfo-etf.component.html',
  styleUrl: './portfo-etf.component.scss',
})
export class PortfoEtfComponent {
  canSee = input.required<boolean>();
  balance = input<number>();
  showWithdrawButton = input<boolean>(true);
  navigationService = inject(WealthNavigationService);
  cashoutAction = {
    icon: 'arrow-up',
    type: 'linear',
    title: 'برداشت',
    id: 'cash-out',
    active: true,
  };
  cashinAction = {
    icon: 'plus',
    type: 'linear',
    title: 'واریز',
    id: 'cash-in',
    active: true,
  };

  cashout() {
    if (this.cashoutAction.active && this.balance() && this.showWithdrawButton()) {
      this.navigationService.navigate([CASHOUT_ROUTE]);
    }
  }
  cashin() {
    this.navigationService.navigate([CASHIN_ROUTE]);
  }
}
