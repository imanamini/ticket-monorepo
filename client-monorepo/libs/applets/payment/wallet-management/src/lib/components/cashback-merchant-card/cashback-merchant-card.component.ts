import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxIcon } from '@digipay/ngx-icon';
import { BalancesInterface } from '../../data-access/models/balance.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Router } from '@angular/router';

@Component({
  selector: 'wallet-mng-applet-cashback-merchant-card',
  standalone: true,
  imports: [
    NgxIcon,
    PipesModule,
    ApiImageModule,

  ],
  templateUrl: './cashback-merchant-card.component.html',
  styleUrl: './cashback-merchant-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashbackMerchantCardComponent {
  private readonly router = inject(Router);
  public data = input.required<BalancesInterface>();

  onNavigateToStore() {
    this.router.navigate(['/stores/all-stores'], {
      queryParams: {
        sort: 'priority',
      },
    });
  }
}
