import { Component, inject, input } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-pending-transaction-empty',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './pending-transaction-empty.component.html',
  styleUrl: './pending-transaction-empty.component.scss',
})
export class PendingTransactionEmptyComponent {
  state = input.required<string>();
  navigationService = inject(WealthNavigationService);

  startInvestment() {
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
      queryParams: {
        type: 'FixedIncome',
      },
    });
  }
}
