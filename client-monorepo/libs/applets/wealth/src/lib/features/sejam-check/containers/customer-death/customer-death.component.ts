import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

@Component({
  selector: 'wealth-applet-customer-death',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent, NgxIcon],
  templateUrl: './customer-death.component.html',
  styleUrl: './customer-death.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDeathComponent {
  private navigationService = inject(WealthNavigationService);

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, 'treasury']);
  }
}
