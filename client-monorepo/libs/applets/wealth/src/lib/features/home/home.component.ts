import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { NgClass } from '@angular/common';
import { HomeAssetsComponent } from './components/home-assets/home-assets.component';
import { HomeBannerComponent } from './components/home-banner/home-banner.component';
import { HomeCategoriesComponent } from './components/home-categories/home-categories.component';
import { HomeNewsComponent } from './components/home-news/home-news.component';

import { WalkThroughService } from '@client-monorepo/shared/common/walk-through';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxAppBarButtonType } from '@digipay/ngx-app-bar';
import { ButtonIcon } from '@digipay/ngx-button';

import { BaseComponent } from '../../components/core/components/base/base.component';
import { EIntrackEventName } from '../../components/core/models/intrack-event-name.enum';
import { LeadService } from '../../components/core/services/lead.service';
import { checkWealthOrigin } from '../../components/utils/check-wealth-origin';
import { WEALTH_TOKEN } from '../../components/utils/variables';

import { PROFILE_ROUTE, TRANSACTIONS_ROUTE } from '../../data-access/constants/app-routes';
import { TokenModel } from '../../data-access/models/base/token.model';
import { DashboardBanner, DashboardCategory } from '../../data-access/models/dashboard-parts.model';
import { ProfileResponse } from '../../data-access/models/profile-response.model';
import { BackToOriginService } from '../../shared/services/back-to-origin.service';
import { AppBarWrapperComponent } from '../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerService } from '../../components/core/services/v1/customer.service';
import { IPortfoliosHeadup } from '../../components/core/models/customer-schemas';
import {
  WEALTH_BANNERS,
  WEALTH_SECOND_BANNERS,
  DP_BANNERS,
  DP_SECOND_BANNERS,
  HEADER_LEFT_BUTTON,
  HEADER_LEFT_ICON,
} from './configs/static-config';
import { WalletService } from '../wallet/services/wallet.service';
import { OnboardingProfitService } from '../../shared/services/onboarding-profit.service';

@Component({
  selector: 'wealth-applet-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [NgClass, AppBarWrapperComponent, HomeAssetsComponent, HomeBannerComponent, HomeCategoriesComponent, HomeNewsComponent],
})
export class HomeComponent extends BaseComponent implements OnInit {
  // --- Signals ---
  loadingPortfolios = signal(true);
  isWebsite = signal(true);
  userProfile = signal<ProfileResponse | undefined>(undefined);
  portfolio = signal<IPortfoliosHeadup | undefined>(undefined);
  wealthBanner = signal<DashboardBanner[]>(WEALTH_BANNERS);
  wealthSecondBanner = signal<DashboardBanner[]>(WEALTH_SECOND_BANNERS);
  dpBanners = signal<DashboardBanner[]>(DP_BANNERS);
  dpSecondBanners = signal<DashboardCategory[]>(DP_SECOND_BANNERS);
  headerLeftButton = signal<NgxAppBarButtonType>(HEADER_LEFT_BUTTON);
  headerLeftIcon = signal<ButtonIcon>(HEADER_LEFT_ICON);
  updatingPortfolios = signal(false);

  // --- Services ---
  private destroyRef = inject(DestroyRef);
  private leadService = inject(LeadService);
  private customerService = inject(CustomerService);
  private backToOrigin = inject(BackToOriginService);
  private eventService = inject(NgxEventTrackerService);
  public walkThroughService = inject(WalkThroughService);
  private navigationService = inject(WealthNavigationService);
  private walletService = inject(WalletService);
  private onboardingService = inject(OnboardingProfitService);

  ngOnInit() {
    this.setPlatformFlag();
    this.portfoliosHeadup();
    this.trackHomePageView();
    this.walletService.stopGoldPricingTimer();
    this.onboardingService.checkProfitOnboard();
  }

  /** -------------------
   * Init Methods
   -------------------- */
  private setPlatformFlag() {
    this.isWebsite.set(checkWealthOrigin() === 'wealth');
  }

  portfoliosHeadup() {
    this.customerService.portfoliosHeadup().subscribe((res) => {
      this.portfolio.set(res?.result);
      this.loadingPortfolios.set(false);

      // TODO: Change onboarding API
      // if (this.userProfile()?.onboardedSections) {
      //   this.wealthWalkthroughService.startWalkthrough(this.userProfile()!.onboardedSections);
      // }
    });

    this.loadLeadIfTokenPresent();
  }

  private loadLeadIfTokenPresent() {
    const wealthToken: TokenModel = JSON.parse(localStorage.getItem(WEALTH_TOKEN) || 'null');
    if (!wealthToken?.accessToken) return;
    this.leadService.getLead().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private trackHomePageView() {
    this.eventService.sendEvent({
      eventName: EIntrackEventName.HOME_PAGE_VIEW,
      eventData: {},
    });
  }

  /** -------------------
   * UI Actions
   -------------------- */
  onBackHandler() {
    this.backToOrigin.goBackToOrigin();
  }

  goToTransactions() {
    this.navigationService.navigate([TRANSACTIONS_ROUTE]);
  }

  goToProfile() {
    this.navigationService.navigate([PROFILE_ROUTE]);
  }
}
