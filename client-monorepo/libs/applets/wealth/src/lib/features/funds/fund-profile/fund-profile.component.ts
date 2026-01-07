import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { concatMap, tap } from 'rxjs';
import { IFundChart, IFundPortfolioChart, IFundPortfolioGoldChart } from '../models/fund-chart.model';
import { FundProfileInfoCardComponent } from './components/fund-profile-info-card/fund-profile-info-card.component';
import { FundProfilePriceCardComponent } from './components/fund-profile-price-card/fund-profile-price-card.component';
import { FundProfileUserAssetsComponent } from './components/fund-profile-user-assets/fund-profile-user-assets.component';
import { FundProfileGeneralInfoComponent } from './components/fund-profile-general-info/fund-profile-general-info.component';
import { FundProfileFooterComponent } from './components/fund-profile-footer/fund-profile-footer.component';
import { AssetsCompositionChartComponent } from './components/assets-composition-chart/assets-composition-chart.component';
import { NavChartComponent } from './components/nav-chart/nav-chart.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { EIntrackEventName } from '../../../components/core/models/intrack-event-name.enum';
import { PURCHASE_ROUTE, SELL_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ICollateralStatusResult } from '../../collateral/data-access/models/collateral-status-result.interface';
import { ECollateralRequestStatus } from '../../collateral/data-access/models';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { NgClass } from '@angular/common';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { IButton } from '../../ipo/models/ipo-buttons.interface';
import { FundsService } from '../../../components/core/services/v1/funds.service';
import { IFundDetail } from '../../../components/core/models/fund-schemas';
import { CustomerService } from '../../../components/core/services/v1/customer.service';
import { IPortfolio } from '../../../components/core/models/customer-schemas/portfolio.interface';
import { IPurchaseRouteState } from '../../purchase/models/purchase-state.interface';
import { UserActivitiesService } from '../../../shared/services/activities/user-activities.service';
import { CollateralService } from '../../collateral/data-access/services/collateral.service';

@Component({
  selector: 'app-fund-profile',
  standalone: true,
  imports: [
    FundProfileFooterComponent,
    FundProfileInfoCardComponent,
    FundProfilePriceCardComponent,
    FundProfileUserAssetsComponent,
    FundProfileGeneralInfoComponent,
    AssetsCompositionChartComponent,
    NavChartComponent,
    NgxButtonComponent,
    SpinnerComponent,
    NgClass,
    NgxSegmentedControlComponent,
  ],
  templateUrl: './fund-profile.component.html',
  styleUrl: './fund-profile.component.scss',
})
export class FundProfileComponent extends BaseComponent implements OnInit, OnDestroy {
  symbol = signal<string | undefined>(undefined);
  profile = signal<IFundDetail | undefined>(undefined);

  navChart = signal<IFundChart[]>([]);
  compositionChart = signal<(IFundPortfolioChart & Partial<IFundPortfolioGoldChart>)[]>([]);
  chartTab = signal<boolean>(true);

  customerPortfolio = signal<IPortfolio | undefined>(undefined);
  customerPortfolioLoading = signal<boolean>(true);

  isLoading = signal<boolean>(true);

  buttons = signal<IButton[]>([]);
  qParams = signal<Params | undefined>(undefined);
  collateralResult = signal<ICollateralStatusResult | undefined>(undefined);
  collateralTitle = signal<string | undefined>(undefined);
  collateralDescription = signal<string | undefined>(undefined);

  options = computed<SegmentItemsModel[]>(() => [
    { text: 'نمودارها', id: 'Charts', value: 'CHARTS', disable: this.compositionChart()?.length == 0 },
    { text: 'اطلاعات کلی', id: 'Info', value: 'GENERAL_INFO', disable: false },
  ]);

  userAssetsComputedClass = computed<string>(() => {
    const fundsClass: Record<string, string> = {
      '11394': 'padash',
      '11997': 'damavand',
      '11421': 'golrang',
      '10883': 'gardeshgari',
      IRT3SSSF0001: 'sina',
      IRTKLOTF0001: 'lotus',
    };
    return fundsClass[this.symbol()];
  });

  protected readonly ECollateralRequestStatus = ECollateralRequestStatus;
  private navigationService = inject(WealthNavigationService);
  private backHandler = inject(BackHandlerService);
  private activatedRoute = inject(ActivatedRoute);
  private fundsService = inject(FundsService);
  private eventService = inject(NgxEventTrackerService);
  private collateralService = inject(CollateralService);
  private customerService = inject(CustomerService);
  private userActivitiesService = inject(UserActivitiesService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.fetchFundData();
    this.fetchLaunch();
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.setCustomBackUrl(queryParams);
    const activity = {
      eventId: 'wth_instrument_profile_view',
      payloads: {
        InstrumentId: this.activatedRoute.snapshot.params['id'],
        ...(queryParams['referrer'] ? { Referrer: queryParams['referrer'] } : {}),
      },
    };
    this.userActivitiesService.action(activity).subscribe();
  }

  private setCustomBackUrl(queryParams: Params): void {
    this.qParams.set(queryParams);
    if (this.qParams()['referrer']) {
      this.backHandler.setCustomBackUrl('hub');
    }
  }

  private fetchFundData(): void {
    this.activatedRoute.params
      .pipe(
        concatMap((params) => this.handleRouteParams(params)),
        concatMap(() => this.fetchFundChart()),
        concatMap(() => this.fetchCustomerPortfolio()),
      )
      .subscribe((userAssets) => this.handleUserAssets(userAssets?.result));
  }

  private handleRouteParams(params: any) {
    this.symbol.set(params['id']);
    this.eventService.sendEvent({
      eventName: EIntrackEventName.FUND_PROFILE_DETAIL,
      eventData: { FundId: this.symbol() },
    });

    return this.fundsService.getFundProfileBySymbol(this.symbol()).pipe(
      tap((fundProfile) => {
        if (fundProfile?.success) {
          this.profile.set(fundProfile.result);
        }
        this.isLoading.set(false);
      }),
    );
  }

  private fetchFundChart() {
    return this.fundsService.getChart(this.symbol()).pipe(
      tap((fundChart) => {
        if (fundChart?.success) {
          this.navChart.set(fundChart.result.details);
          this.compositionChart.set(fundChart.result.portfolioDetails);
        }
      }),
    );
  }

  private fetchCustomerPortfolio() {
    return this.customerService.getPortfoliosBysymbol(this.symbol());
  }

  private handleUserAssets(customerPortfolio: IPortfolio) {
    const buttons = [];
    if (this.profile()?.sellable && customerPortfolio?.quantity > 0) {
      buttons.push({ label: 'فروش', style: 'tinted-on-elevated', isActive: true, id: 'sell' });
    }
    if (this.profile()?.buyable) {
      buttons.push({ label: 'سرمایه‌گذاری', style: 'fill', isActive: true, id: 'buy' });
    }

    this.buttons.set(buttons);
    this.customerPortfolio.set(customerPortfolio);
    this.customerPortfolioLoading.set(false);
  }

  private fetchLaunch() {
    this.collateralService.launch(this.symbol()).subscribe((res) => {
      if (!res?.success) return;
      this.collateralResult.set(res.result);
      if (res.result.status !== ECollateralRequestStatus.None) {
        this.setCollateralTexts(res.result);
      }
    });
  }

  private setCollateralTexts(result: any) {
    const statusMap = {
      [ECollateralRequestStatus.Init]: {
        title: 'واحد‌ها رو وثیقه کن، اعتبار ۴ قسطه بگیر!',
        desc: 'با وثیقه کردن واحد‌های این صندوق، تا سقف ۵۰ میلیون تومان اعتبار ۴ قسطه دریافت کنید.',
      },
      [ECollateralRequestStatus.Approved]: {
        title: `${result.units} واحد از دارایی شما وثیقه شده است`,
        desc: 'شما با وثیقه کردن واحد‌های خود اعتبار ۴ قسطه دریافت کرده‌اید. تا پایان بازپرداخت اقساط، امکان آزاد سازی این واحد‌ها را ندارید.',
      },
      [ECollateralRequestStatus.Pending]: {
        title: 'درخواست وثیقه شدن واحد‌های شما در حال بررسی است...',
        desc: 'بعد از ۱ تا ۲ روز کاری، نتیجه درخواست را از طریق پیامک به شما اطلاع می‌دهیم.',
      },
      [ECollateralRequestStatus.Rejected]: {
        title: 'درخواست شما برای وثیقه کردن واحد‌های این صندوق رد شد',
        desc: '',
      },
    };

    const { title, desc } = statusMap[result.status] ?? { title: '', desc: '' };
    this.collateralTitle.set(title);
    this.collateralDescription.set(desc);
  }

  override ngOnDestroy() {
    this.backHandler.setCustomBackUrl(undefined);
  }

  handleActiveSection(buttonLabel: SegmentItemsModel) {
    switch (buttonLabel.id) {
      case 'Info':
        this.chartTab.set(false);
        break;
      case 'Charts':
        this.chartTab.set(true);
        break;
    }
  }

  action(type: string) {
    if (type === 'SELL') {
      this.navigationService.navigateWithState([SELL_ROUTE, this.profile()?.symbol], {
        state: {
          referrer: this.qParams()['referrer'],
        },
      });
    } else {
      this.eventService.sendEvent({
        eventName: EIntrackEventName.PROFILE_INVESTMENT_SELECT,
        eventData: {
          FundId: this.symbol(),
        },
      });

      const routeState: IPurchaseRouteState = {
        investmentType: this.profile().investmentType,
        type: this.profile().type,
        fundProfile: this.profile(),
        referrer: this.qParams()['referrer'],
        backTo: 'profile',
      };
      this.navigationService.navigateWithState([PURCHASE_ROUTE, this.symbol()], {
        state: routeState,
      });
    }
  }
}
