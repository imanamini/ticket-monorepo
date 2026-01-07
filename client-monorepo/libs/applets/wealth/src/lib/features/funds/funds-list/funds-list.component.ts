import { takeUntil } from 'rxjs';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

import { BackHandlerService } from '@client-monorepo/back-handler';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

import { IIntroductionData } from './models/introduction.interface';
import { IFundIntroduction } from './models/fund-introduction.interface';
import { IFundList, FundsRiskLevel, FundsSortType } from '../../../components/core/models/fund-schemas';

import { LocationService } from '../../../shared/services/location.service';
import { BackToOriginService } from '../../../shared/services/back-to-origin.service';
import { FundsService } from '../../../components/core/services/v1/funds.service';

import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { FundsListItemComponent } from './components/funds-list-item/funds-list-item.component';
import { SortBottomSheetComponent } from './components/sort-bottom-sheet/sort-bottom-sheet.component';
import { IntroductionBottomSheetComponent } from './components/introduction-bottom-sheet/introduction-bottom-sheet.component';

import { HOME_ROUTE, INVESTMENT_LIST_ROUTE } from '../../../data-access/constants/app-routes';

@Component({
  selector: 'app-funds-list',
  standalone: true,
  imports: [NgxButtonComponent, FundsListItemComponent, NgxAppBarComponent, NgxIcon, SpinnerComponent],
  templateUrl: './funds-list.component.html',
  styleUrl: './funds-list.component.scss',
})
export class FundsListComponent extends BaseComponent implements OnInit, OnDestroy {
  funds = signal<IFundList[] | undefined>(undefined);
  originalFunds = signal<IFundList[] | undefined>(undefined);
  isLoading = signal<boolean>(true);
  qParams = signal<Params | undefined>(undefined);
  pageTitle = signal<string | undefined>(undefined);
  fundIntroduction = signal<IFundIntroduction | undefined>(undefined);
  sortedBy = signal<FundsSortType>('default');

  private navigationService = inject(WealthNavigationService);
  private backHandler = inject(BackHandlerService);
  private bottomSheet = inject(NgxBottomSheetService);
  private activatedRoute = inject(ActivatedRoute);
  private fundsService = inject(FundsService);
  private location = inject(LocationService);
  private backToOrigin = inject(BackToOriginService);

  ngOnInit(): void {
    this.initializePage();
  }

  override ngOnDestroy() {
    this.backHandler.setCustomBackUrl(undefined);
  }

  private initializePage(): void {
    const params = this.activatedRoute.snapshot.queryParams;
    this.qParams.set(params);

    const type = params['type']?.toLowerCase() || 'fixedincome';
    this.fundIntroduction.set({
      type,
      imageUrl: this.getImageUrl(type),
      title: this.getTitle(type),
    });

    this.pageTitle.set(this.getPageTitle(type));

    if (params['referrer']) {
      this.backHandler.setCustomBackUrl('hub');
    }

    this.fetchFunds(params['type'] || 'FixedIncome');
  }

  private fetchFunds(type: string): void {
    this.isLoading.set(true);

    this.fundsService
      .getAllFunds(type)
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        if (res?.success) {
          this.funds.set(res.result);
          this.originalFunds.set(res.result);
        }
        this.isLoading.set(false);
      });
  }

  showIntroduction(type: string): void {
    const data = this.getIntroductionData(type);
    if (data) {
      this.bottomSheet.openBottomSheet(
        IntroductionBottomSheetComponent,
        { data },
        {
          noPadding: true,
        },
      );
    }
  }

  onBackHandler(): void {
    this.handleBackNavigation(this.location.lastRoute);
  }

  sortBottomSheet(): void {
    this.bottomSheet.openBottomSheet(SortBottomSheetComponent, { data: this.sortedBy() });

    this.bottomSheet.onClose.pipe(takeUntil(this.destroyObservable)).subscribe(() => {
      const result = this.bottomSheet.outputData();
      if (result) this.onSortChanged(result);
    });
  }

  private onSortChanged(value: FundsSortType): void {
    this.sortedBy.set(value);
    this.funds.set(this.sortFundsBy(value));
  }

  private sortFundsBy(type: FundsSortType): IFundList[] {
    const riskOrder: FundsRiskLevel[] = ['low', 'medium', 'high'];
    const fundsList = this.funds() || [];

    switch (type) {
      case 'maxProfit':
        return [...fundsList].sort((a, b) => parseFloat(b.profit) - parseFloat(a.profit));

      case 'minRisk':
        return [...fundsList].sort((a, b) => riskOrder.indexOf(a.riskLevel) - riskOrder.indexOf(b.riskLevel));

      default:
        return [...(this.originalFunds() || [])];
    }
  }

  private handleBackNavigation(lastRoute: string): void {
    const url = lastRoute?.split('?')[0];
    const params = this.qParams() || {};
    const query: Params = { type: params['type'] };

    if (params['referrer']) {
      query['referrer'] = params['referrer'];
      this.backToOrigin.goBackToOrigin();
      return;
    }

    switch (url) {
      case '/home':
        this.navigationService.navigate([HOME_ROUTE]);
        break;
      case '/investments':
        this.navigationService.navigateWithQueryParams([INVESTMENT_LIST_ROUTE], { queryParams: query });
        break;
      case null:
      case undefined:
        this.backToOrigin.goBackToOrigin();
        break;
      default:
        this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  private getPageTitle(type: string): string {
    const titles: Record<string, string> = {
      fixedincome: 'صندوق‌های درامد ثابت',
      index: 'صندوق‌های شاخصی',
      gold: 'سرمایه‌گذاری مبتنی بر طلا',
    };
    return titles[type] || titles['fixedincome'];
  }

  private getImageUrl(type: string): string {
    const images: Record<string, string> = {
      fixedincome: 'wealth-assets/images/fixedincome-background.png',
      gold: 'wealth-assets/images/gold-background.png',
      index: 'wealth-assets/images/index-background.png',
    };
    return images[type] || '';
  }

  private getTitle(type: string): string {
    const titles: Record<string, string> = {
      fixedincome: 'اطلاعاتت رو درباره صندوق درامد ثابت بیشتر کن!',
      gold: 'میخوای درباره صندوق طلا بیشتر بدونی؟',
      index: 'اطلاعاتت رو درباره صندوق شاخصی بیشتر کن!',
    };
    return titles[type] || '';
  }

  private getIntroductionData(type: string): IIntroductionData | undefined {
    const introData: Record<string, IIntroductionData> = {
      gold: {
        image: 'wealth-assets/images/gold-background-bottomsheet.png',
        title: 'صندوق‌طلا چیست؟',
        bullets: [
          'صندوق های طلا راهی ساده و مطمئن برای سرمایه گذاری در بازار طلا هستند.',
          'دارایی این صندوق ها ترکیبی از سکه و شمش طلا است و ارزش آن‌ها متناسب با قیمت روز طلا نوسان دارد.',
          'طلای فیزیکی خریداری شده در خزانه‌های بانک و بورس کالا نگهداری می‌شود.',
          'این صندوق‌ها تحت مدیریت معتبرترین نهادهای مالی و نظارت سازمان بورس فعالیت می‌کنند.',
        ],
      },
      index: {
        image: 'wealth-assets/images/index-background.png',
        title: 'صندوق شاخصی چیست؟',
        descriptions: [
          'نمونه نمودار صندوق تجارت شاخصی کاردان بین ۱۴۰۳/۰۸/۰۱ تا ۱۴۰۳/۱۰/۱۸:',
          'همانطور که مشاهده می‌کنید، تغییرات ارزش این صندوق هم‌راستا با شاخص کل بورس بوده است.',
        ],
        bullets: [
          'بازدهی متناسب با شاخص کل بورس.',
          'ریسک بیشتر نسبت به صندوق‌های درآمد ثابت.',
          'مبلغ سرمایه‌گذاری متناسب با شاخص کل بورس تغییر می‌کند.',
        ],
        chartImage: 'wealth-assets/images/index-fund-chart.png',
      },
      fixedincome: {
        image: 'wealth-assets/images/fixedincome-background.png',
        title: 'صندوق درامد ثابت چیست؟',
        bullets: [
          'کم‌ریسک‌ترین روش‌های سرمایه‌گذاری با تمرکز بر اوراق بدهی و سپرده بانکی.',
          'ارائه در دو نوع صدور و ابطالی و ETF.',
          'برخی با تقسیم سود ماهانه و برخی با اضافه‌کردن سود به سرمایه اصلی.',
          'نوسان قیمتی کم و گزینه‌ای مطمئن برای سرمایه‌گذاری.',
        ],
      },
    };

    return introData[type];
  }
}
