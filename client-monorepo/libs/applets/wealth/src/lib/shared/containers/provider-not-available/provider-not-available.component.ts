import { Component, inject } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { INVESTMENT_LIST_ROUTE } from '../../../data-access/constants/app-routes';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-provider-not-available',
  standalone: true,
  imports: [NgxAppBarComponent, NgxButtonComponent],
  templateUrl: './provider-not-available.component.html',
  styleUrl: './provider-not-available.component.scss',
})
export class ProviderNotAvailableComponent {
  private navigationService = inject(WealthNavigationService);

  onBackHandler() {
    this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
  }
}
