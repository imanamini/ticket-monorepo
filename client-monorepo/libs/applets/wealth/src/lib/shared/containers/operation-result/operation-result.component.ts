import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CROWD_LIST_ROUTE,
  HOME_ROUTE,
  INVESTMENT_LIST_ROUTE,
  PORTFO,
  PURCHASE_ROUTE,
  TRANSACTIONS_ROUTE,
  WALLETS_ROUTE,
} from '../../../data-access/constants/app-routes';
import { ErrorService } from '../../../components/core/services/error.service';
import { EIntrackEventName } from '../../../components/core/models/intrack-event-name.enum';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { getInstrumentName } from './models/instrument-name';
import { IDynamicButton } from '../../../data-access/models/dynamic-button.interface';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgClass } from '@angular/common';

const RESULT_PAGE_KEY = '__RP__';

@Component({
  selector: 'app-operation-result',
  templateUrl: './operation-result.component.html',
  styleUrls: ['./operation-result.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgClass],
})
export class OperationResultComponent implements OnInit {
  titleText = signal<string>('دوباره تلاش کنید');
  isSuccess = signal<string>('false');
  action = signal<'sell' | 'investment' | 'cashout' | 'cashin'>('investment');
  incomplete = signal<boolean>(false);
  instrumentSymbol = signal<string | undefined>(undefined);

  instrumentName = signal<string | undefined>(undefined);
  receiptNumber = signal<string | undefined>(undefined);
  description = signal<string | undefined>(undefined);
  image = signal<string | undefined>(undefined);
  instrumentType = signal<string | undefined>(undefined);
  ipoDate = signal<string | undefined>(undefined);

  buttonsCondition = computed(() => {
    return this.instrumentSymbol()?.startsWith('IR') && this.action() === 'sell' && this.isSuccess() === 'true';
  });
  private navigationService = inject(WealthNavigationService);
  buttons = computed<IDynamicButton[]>(() => {
    if (this.instrumentType() === 'CrowdFund') {
      return [
        {
          id: 'GOT_IT',
          title: 'متوجه شدم',
          style: 'tinted-on-elevated',
        },
        {
          id: 'PORTFOLIO',
          title: 'مشاهده سبد دارایی',
          style: 'fill',
        },
      ];
    } else {
      return [
        {
          id: 'TRANSACTIONS',
          title: 'سرمایه‌گذاری جدید',
          style: 'tinted-on-elevated',
        },
        {
          id: 'GOT_IT',
          title: 'متوجه شدم',
          style: 'fill',
        },
      ];
    }
  });
  private eventService = inject(NgxEventTrackerService);
  private router = inject(Router);
  private errorService = inject(ErrorService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    this.isSuccess.set(params['isSuccess']);
    this.action.set(params['action']);
    this.receiptNumber.set(params['receiptNumber']);
    this.incomplete.set(params['incomplete']);
    this.instrumentSymbol.set(params['instrumentSymbol']);
    this.instrumentType.set(params['type'] || params['investmentType']);
    this.ipoDate.set(params['ipoDate']?.replaceAll('-', '/'));
    this.instrumentName.set(getInstrumentName(this.instrumentSymbol()));
    this.setParams();

    if (this.errorService.isErrorPageExpired()) {
      this.navigationService.navigate([PURCHASE_ROUTE, this.instrumentSymbol()]);
    }
  }

  private setRouteInLocalstorage() {
    const TEN_DAYS_IN_MS = 10 * 24 * 60 * 60 * 1000;
    const now = new Date();

    const newRoute = {
      value: this.router.url,
      expiry: now.getTime() + TEN_DAYS_IN_MS,
    };

    const storedRoutes = localStorage.getItem(RESULT_PAGE_KEY);
    const routes: Array<{ value: string; expiry: number }> = storedRoutes ? JSON.parse(storedRoutes) : [];

    routes.push(newRoute);
    localStorage.setItem(RESULT_PAGE_KEY, JSON.stringify(routes));
  }

  private isRouteExpired(): string[] | null {
    const storedRoutes = localStorage.getItem(RESULT_PAGE_KEY);
    if (!storedRoutes) {
      this.setRouteInLocalstorage();
      return null;
    }
    let routes: Array<{ value: string; expiry: number }>;
    try {
      routes = JSON.parse(storedRoutes);
    } catch (error) {
      localStorage.removeItem(RESULT_PAGE_KEY);
      return null;
    }
    const existRoute = routes.find((route) => route.value === this.router.url);
    if (!existRoute) {
      this.setRouteInLocalstorage();
      return null;
    }
    const now = new Date().getTime();
    const validRoutes = routes.filter((route) => route.expiry > now);

    if (validRoutes.length !== routes.length) {
      if (validRoutes.length === 0) {
        localStorage.removeItem(RESULT_PAGE_KEY);
        this.setRouteInLocalstorage();
        return null;
      } else {
        localStorage.setItem(RESULT_PAGE_KEY, JSON.stringify(validRoutes));
      }
    }

    return validRoutes.map((route) => route.value);
  }

  onBackClicked() {
    if (this.incomplete()) {
      this.errorService.setErrorPageExpired(false);
      if (
        this.instrumentSymbol() === 'WALLET_FX' ||
        this.instrumentSymbol() === 'WALLET_GOLD' ||
        this.instrumentSymbol() === 'WALLET_MIX'
      ) {
        this.navigationService.navigate([WALLETS_ROUTE, 'treasury']);
      } else {
        if (this.instrumentType() == 'CrowdFund') {
          this.navigationService.navigate([CROWD_LIST_ROUTE, this.instrumentSymbol()]);
        } else {
          this.navigationService.navigate([this.action() === 'sell' ? INVESTMENT_LIST_ROUTE : PURCHASE_ROUTE, this.instrumentSymbol()]);
        }
      }
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  setParams() {
    if (this.incomplete()) {
      this.image.set('wealth-assets/svg/failed-result.svg');
      this.titleText.set('درخواست شما کامل نشد');
      this.description.set('درخواست شما کامل نشد. لطفا دوباره تلاش کنید.');

      return;
    }
    if (this.isSuccess() === 'true') {
      if (this.ipoDate()) {
        this.description
          .set(`سرمایه‌گذاری شما در عرضه اولیه ${this.instrumentName()} در روز ${this.ipoDate().split(' ')[0]} به صورت خودکار انجام خواهد شد.
برای حذف درخواست به صفحه اطلاعات عرضه اولیه بروید.`);
        this.titleText.set('درخواست شما ثبت شد');
        this.image.set('wealth-assets/svg/success-result.svg');
        this.sendEvent();
      } else {
        switch (this.action()) {
          case 'sell':
            this.description.set(
              this.instrumentSymbol()?.startsWith('IRT')
                ? `نهایی شدن فروش واحد‌های صندوق ${this.instrumentName()}،  یک روز کاری زمان می‌برد. مبلغ حاصل از فروش به کیف پول ETF شما واریز خواهد شد.`
                : this.instrumentType() == 'CrowdFund'
                  ? ''
                  : `نهایی شدن فروش واحد‌های صندوق ${this.instrumentName()}، حداکثر ۲ روز کاری زمان می‌برد.`,
            );
            this.titleText.set('درخواست فروش با موفقیت ارسال شد ');
            this.image.set('wealth-assets/svg/success-result.svg');
            break;

          case 'cashout':
            this.description.set(
              'نهایی شدن برداشت حداکثر ۲ روز کاری زمان می‌برد. می‌توانید وضعیت سفارش خود را در قسمت سفارش‌های در انتظار مشاهده کنید.',
            );
            this.titleText.set('درخواست برداشت از کیف پول ETF با موفقیت ثبت شد. ');
            this.image.set('wealth-assets/svg/cashout-successful.svg');
            break;
          case 'cashin':
            this.description.set(undefined);
            this.titleText.set('درخواست افزایش موجودی کیف پول ETF با موفقیت ثبت شد.');
            this.image.set('wealth-assets/svg/sell-successful.svg');
            break;
          default:
            this.titleText.set('درخواست سرمایه‌گذاری با موفقیت ارسال شد ');
            this.image.set('wealth-assets/svg/success-result.svg');
            this.sendEvent();
            break;
        }
      }
    } else {
      switch (this.action()) {
        case 'sell':
          this.description.set('درخواست فروش واحد‌های صندوق، انجام نشد. لطفا دقایقی بعد دوباره تلاش کنید.');
          this.image.set('wealth-assets/svg/failed-result.svg');
          break;
        case 'cashout':
          this.description.set('درخواست برداشت از کیف پول ETF ثبت نشد. لطفا دقایقی بعد دوباره تلاش کنید.');
          this.image.set('wealth-assets/svg/cashout-failed.svg');
          break;
        case 'cashin':
          this.description.set('درخواست افزایش موجودی کیف پول ETF ثبت نشد. لطفا دقایقی بعد دوباره تلاش کنید.');
          this.image.set('wealth-assets/svg/sell-failed.svg');
          break;

        default:
          this.description.set(
            this.instrumentType() == 'CrowdFund'
              ? ' لطفا دقایقی بعد دوباره تلاش کنید.'
              : 'درخواست شما ارسال نشد. لطفا دقایقی بعد دوباره تلاش کنید.',
          );
          this.image.set('wealth-assets/svg/failed-result.svg');
          break;
      }
      this.titleText.set('دوباره تلاش کنید');
    }
  }

  private sendEvent() {
    if (this.isRouteExpired()) return;
    const eventData = {
      eventName: EIntrackEventName.PAYMENT_DONE,
      eventData: {
        Fund_Id: this.instrumentSymbol(),
        State: this.isSuccess(),
        Order_Id: this.receiptNumber(),
      },
    };
    this.eventService.sendEvent(eventData);
  }

  goToPortfo() {
    this.navigationService.navigate([PORTFO]);
  }

  actionHandler(id: string) {
    switch (id) {
      case 'TRANSACTIONS':
        this.navigationService.navigate([HOME_ROUTE]);
        break;
      case 'PORTFOLIO':
        this.navigationService.navigate([PORTFO]);
        break;

      default:
        this.navigationService.navigate([TRANSACTIONS_ROUTE]);
        break;
    }
  }
}
