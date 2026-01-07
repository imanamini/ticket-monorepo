import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { InsCarouselBannersComponent } from '../../components/ins-carousel-banners/ins-carousel-banners.component';
import { MainBanners } from './data-access/constants/home.const';
import { AlertColorEnum } from '../../data-access/enums/alert-color.enum';
import { AlertSizeEnum } from '../../data-access/enums/alert-size.enum';
import { IconEnum } from '../../data-access/enums/icon.enum';
import { InsuranceProductsComponent } from './components/insurance-products/insurance-products.component';
import { BottomNavigationService } from '../../data-access/services/bottom-navigation.service';
import { InsurancePromotionComponent } from '../../components/insurance-promotion/insurance-promotion.component';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { DpxService } from '../../data-access/services/dpx.service';
import { InsurancePromotionModel } from './data-access/models/insurance-promotion.model';
import { ReferrerService } from '../../data-access/services/referrer.service';
import { HeaderService } from '../../data-access/services/header.service';
import { CloseService } from '../vehicle/data-access/services/shared/close.service';
import { FeatureToggleService } from '../../data-access/services/feature-toggle.service';
import { ScrollDirectionDirective } from '../../data-access/directives/scroll-direction.directive';
import { ReferrerEnum } from '../../data-access/enums/referrer.enum';
import { EnvironmentService } from '@client-monorepo/app-core';
import { InsDigikalaService } from '../../data-access/services/ins-digikala.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [
    InsCarouselBannersComponent,
    NgxBadgeModule,
    InsuranceProductsComponent,
    InsurancePromotionComponent,
    MainHeaderComponent,
    ScrollDirectionDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  public bottomNavigationService = inject(BottomNavigationService);
  public dpxService = inject(DpxService);
  public digikalaService = inject(InsDigikalaService);
  public headerService = inject(HeaderService);
  public referrerService = inject(ReferrerService);
  private closeService = inject(CloseService);
  private featureToggleService = inject(FeatureToggleService);

  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  promotions = signal<InsurancePromotionModel[]>([
    {
      icon: 'insurance-assets/images/home/compare.png',
      title: 'همه بیمه‌ها در یک نگاه',
      description: 'قیمت و خدمات تمام شرکت های بیمه رو مقایسه کن و هوشمندانه‌ترین انتخاب رو انجام بده.',
    },
    {
      icon: 'insurance-assets/images/home/anywhere.png',
      title: 'خرید آنلاین ۲۴ ساعته',
      description: 'هر زمان و از هر کجا که هستی، بیمه‌نامه‌ات رو به صورت آنلاین و بدون محدودیت تهیه کن.',
    },
    {
      icon: 'insurance-assets/images/home/bnpl.png',
      title: 'پرداخت اعتباری در ۴ قسط',
      description: 'بیمه‌نامه‌ات رو همین حالا بگیر و بدون چک و سفته، هزینه‌اش رو به صورت اعتباری در ۴ قسط پرداخت کن.',
    },
    {
      icon: 'insurance-assets/images/home/fast.png',
      title: 'صدور آنی، استفاده فوری',
      description: 'اگر بیمه‌نامه‌ات نیاز به بازدید نداشته باشه، همون روز صادر و قابل استفاده خواهد بود.',
    },
    {
      icon: 'insurance-assets/images/home/support.png',
      title: 'همیشه کنار تو هستیم',
      description: 'در هر مرحله از خرید یا استفاده از بیمه، پشتیبانی دیجی‌پی به صورت ۲۴ ساعته در کنارت هست.',
    },
  ]);

  protected readonly IconEnum = IconEnum;
  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly mainBanners = computed(() => {
    if (this.digikalaService.isDigikala) {
      return MainBanners.filter((banner) => !banner.alt.includes('equipment-marketing'));
    }
    return MainBanners;
  });

  protected readonly hideIconRight = signal(this.digikalaService.isDigikala);

  ngOnInit(): void {
    if (this.shouldRedirectToHub()) {
      location.href = 'https://app.mydigipay.com/';
    }
    this.setUpNavigation();
  }

  shouldRedirectToHub(): boolean {
    return (
      this.featureToggleService.featureToggleSource.getValue() === false &&
      this.dpxService.IsEnteredFromDpx &&
      this.environment.name === 'production' &&
      this.referrerService.referrer !== ReferrerEnum.ONSITE &&
      window.location.pathname === '/mini-app/insurance/'
    );
  }

  setUpNavigation(): void {
    this.bottomNavigationService.setup();
  }

  backButtonClicked(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.closeService.close();
    } else {
      window.history.back();
    }
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.cleanUp();
  }
}
