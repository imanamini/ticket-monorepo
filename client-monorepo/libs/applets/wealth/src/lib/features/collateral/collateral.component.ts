import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { ICollateralPageState, IProcessData, COLLATERAL_PAGE_ROUTE_MAP } from './data-access/models';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { CollateralService } from './data-access/services/collateral.service';
import { finalize } from 'rxjs';
import { HOME_ROUTE } from '../../data-access/constants/app-routes';

@Component({
  selector: 'wealth-applet-collateral',
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgxCalloutComponent],
  templateUrl: './collateral.component.html',
  styleUrl: './collateral.component.scss',
})
export class CollateralComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private collateralService = inject(CollateralService);
  private navigationService = inject(WealthNavigationService);

  isLoading = signal(false);
  stepItems = signal<string[]>([
    'توثیق دارایی به معنای استفاده از دارایی های موجود شما به عنوان ضمانت برای دریافت اعتبار است؛ به این صورت که دارایی شما در صندوق ارزش آفرین گلبرگ به عنوان وثیقه قرار گرفته و تا سقف 80 درصد ارزش اسمی واحدها به شما اعتبار 4 قسطه تعلق می گیرد.',
    ' در صورتی که دارایی شما در صندوق قبلاً وثیقه شده باشد یا دارایی کافی به میزان مبلغ وثیقه موجود نباشد، اعتبار تخصیص داده نمی شود.',
    ' در صورت عدم پرداخت اقساط در موعد مقرر، دارایی وثیقه شده به نفع دیجی پی ابطال خواهد شد.',
    ' ثبت وثیقه به معنای تخصیص قطعی اعتبار نیست؛ اعتبار تنها پس از ثبت موفقیت آمیز وثیقه و بر اساس شرایط تعیین شده تخصیص می یابد.',
    ' رفع توثیق پس از تسویه کلیه بدهی ها و به درخواست کاربر انجام خواهد شد.',
  ]);
  calloutMessages = signal<string[]>([
    'تا سقف ۵۰ میلیون تومان، اعتبار ۴ قسطه دریافت خواهید کرد.',
    'نداشتن اعتبار ۴ قسطه فعال و یا اقساط معوق از شروط دریافت اعتبار است.',
  ]);
  symbol = signal<string | undefined>(undefined);
  state = signal<ICollateralPageState | undefined>(undefined);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.symbol.set(this.activatedRoute.snapshot.paramMap?.get('symbol'));
  }

  continue() {
    this.isLoading.set(true);
    const symbol = this.symbol();
    const data: IProcessData = {
      instrumentSymbol: symbol,
    };
    this.collateralService
      .process(data, this.state()?.coordinatorAction)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => {
        if (res?.success) {
          const route = COLLATERAL_PAGE_ROUTE_MAP[res.result.data.pageName as string] ?? HOME_ROUTE;
          const state = {
            symbol: symbol,
            phoneNumber: res?.result?.data?.phoneNumber,
            coordinatorAction: res?.result?.data?.coordinatorAction,
            nationalId: res?.result?.data?.nationalId,
            maxAmount: res?.result?.data?.maxAmount,
            minAmount: res?.result?.data?.minAmount,
            data: res?.result?.data,
            countDown: res?.result?.data?.countdownInSeconds,
          };
          this.navigationService.navigate(route, {
            state,
          });
        }
      });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}
