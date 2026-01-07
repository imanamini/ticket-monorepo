import { Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ResponseError } from '../../../data-access/models/response-error.model';
import { HOME_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sejam-error',
  templateUrl: './sejam-error.component.html',
  styleUrls: ['./sejam-error.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgClass],
})
export class SejamErrorComponent {
  errorInfo: ResponseError | null = null;
  state: { title?: ''; description?: string } | undefined;

  private routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);

  reasons: ISejamReason[] = [
    {
      title: 'حساب سجام ندارید',
      button: {
        id: ESejamReason.NO_SEJAM,
        title: 'ثبت‌نام سجام',
      },
    },
    {
      title: 'ثبت‌نام سجام را کامل نکرده‌اید',
      button: {
        id: ESejamReason.NOT_COMPLETED,
        title: 'تکمیل ثبت‌نام',
      },
    },
    {
      title: 'احراز هویت سجام را انجام نداده‌اید',
      button: {
        id: ESejamReason.NO_IDENTITY,
        title: 'احراز هویت',
      },
    },
    {
      title: 'کد شعبه بانک خود را در حساب سجامتان وارد نکرده‌اید',
    },
    {
      title: 'نوع حساب بانکی خود را در حساب سجامتان مشخص نکرده‌اید',
    },
  ];

  constructor() {
    this.state = this.routeState.getAll();
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  sejamIdentify(reson: ESejamReason) {
    switch (reson) {
      case ESejamReason.NO_SEJAM:
        window.open('https://profilesejam.csdiran.ir/session#/', '_blank');
        break;
      case ESejamReason.NOT_COMPLETED:
        window.open('https://profilesejam.csdiran.ir/session#/', '_blank');
        break;
      case ESejamReason.NO_IDENTITY:
        window.open('https://sejamreg.rayanhamafza.com/?dsCode=790#/views/entry.html?ver=202412091049', '_blank');
        break;
    }
  }
}

interface ISejamReason {
  title: string;
  button?: {
    id: ESejamReason;
    title: string;
  };
}

enum ESejamReason {
  NO_SEJAM = 'NO_SEJAM',
  NOT_COMPLETED = 'NOT_COMPLETED',
  NO_IDENTITY = 'NO_IDENTITY',
}
