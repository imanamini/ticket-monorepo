import { Component, inject, OnInit } from '@angular/core';
import { ErrorService } from '../../../components/core/services/error.service';
import { NATIONAL_ID_ROUTE } from '../../../data-access/constants/app-routes';
import { ResponseError } from '../../../data-access/models/response-error.model';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';

@Component({
  selector: 'app-national-id-error',
  templateUrl: './national-id-error.component.html',
  styleUrls: ['./national-id-error.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent],
})
export class NationalIdErrorComponent implements OnInit {
  errorInfo: ResponseError | null = null;
  state:
    | {
        type?: 'FixedIncome';
        symbol?: '';
        amount?: 0;
        unitCount?: 0;
        phoneNumber?: 0;
      }
    | undefined;

  private errorService = inject(ErrorService);
  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.state = this.routeState.getAll();
    this.errorInfo = this.errorService.getParams();
  }

  onBackHandler() {
    this.errorService.clearParams();
    this.navigationService.navigateWithState([NATIONAL_ID_ROUTE], {
      state: {
        symbol: this.state?.symbol,
        type: this.state?.type,
        amount: this.state?.amount,
        unitCount: this.state?.unitCount,
      },
    });
  }
}
