import { Component, inject, OnInit } from '@angular/core';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../../data-access/constants/app-routes';
import { Router } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'wealth-applet-collateral-rejected-result',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, SpinnerComponent],
  templateUrl: './collateral-rejected-result.component.html',
  styleUrl: './collateral-rejected-result.component.scss',
})
export class CollateralRejectedResultComponent implements OnInit {
  isLoading = false;
  navigationService = inject(WealthNavigationService);

  rejectedReasons: string[] = [];

  state: any;

  private routeState = inject(RouteStateService);
  private router = inject(Router);

  ngOnInit(): void {
    this.rejectedReasons = ['داشتن اقساط معوق', 'داشتن اعتبار ۴ قسطه فعال', 'درخواست وثیقه شدن مبلغ بیشتر از موجودیتان در صندوق'];
    this.state = this.routeState.getAll();
  }

  continue() {
    this.router.navigateByUrl('/service/bnpl/overview');
  }

  onBackHandler() {
    if (this.state?.symbol) {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.state?.symbol]);
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }
}
