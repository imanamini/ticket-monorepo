import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import {
  HOME_ROUTE,
  INVESTMENT_LIST_ROUTE,
  SEJAM_CHECK_ROUTE,
  SEJAM_NATIONAL_ID_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'wealth-applet-sejam-successful',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent, SpinnerComponent],
  templateUrl: './sejam-successful.component.html',
  styleUrl: './sejam-successful.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SejamSuccessfulComponent implements OnInit {
  isLoading = signal(false);
  state = { hasAccess: false, prevRoute: 'home' };

  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state = this.routeState.getAll();
    if (!this.state.hasAccess) {
      this.navigationService.navigate([SEJAM_CHECK_ROUTE]);
    }
  }

  onBackHandler() {
    this.navigationService.navigate(this.state.prevRoute === 'nationalIdCheck' ? [SEJAM_NATIONAL_ID_ROUTE] : [HOME_ROUTE]);
  }

  gotIt() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
  onCardClick() {
    this.navigationService.navigateWithQueryParams([INVESTMENT_LIST_ROUTE], {
      queryParams: { type: 'Gold' },
    });
  }
}
