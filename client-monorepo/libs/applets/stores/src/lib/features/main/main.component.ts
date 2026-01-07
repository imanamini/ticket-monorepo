import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AssetCategoriesEnum, AssetPreviewMiniComponent, AssetSectionComponent } from '@client-monorepo/common/user-assets';
import { ActivatedRoute, Router } from '@angular/router';
import { BannersApiService } from '@client-monorepo/libs/shared/common/banners';
import { PromotionApiService, PromotionGroupInterface } from '@client-monorepo/common/promotions';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { OnlineStoresComponent } from '../../components/online-stores/online-stores.component';
import { OnsiteStoresComponent } from '../../components/onsite-stores/onsite-stores.component';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import {
  Banner,
  DisasterLevelService,
  HeaderBackgroundDirective,
  InitiatorService,
  LayoutService,
  PerformanceTierService,
} from '@client-monorepo/common/utilities';
import { GeoEntityService, LocationService } from '@client-monorepo/common/location-management';
import { SocialStoresComponent } from '../../components/social-stores/social-stores.component';
import { ScrollAnimationConfig, ScrollAnimationService } from '@client-monorepo/common/animations';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxNoticeService } from '@digipay/ngx-notice';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { OfflineSheetOptionComponent } from '@client-monorepo/shared/common/offline-payment';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxStatusLightComponent, StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@digipay/ngx-status-light';
import { MessageManagementService } from '@client-monorepo/shared/common';
import { AnimatedListComponent, AnimatedListDirective } from '@client-monorepo/common/ui-components';
import { NgxIcon } from '@digipay/ngx-icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocialService } from '@client-monorepo/social';
import { CampaignService } from '@client-monorepo/campaign';
import { StoresService } from '@client-monorepo/stores';
import { NgxRouterLoadingDirective } from '@digipay/ngx-router-loading';

@Component({
  selector: 'stores-applet-main',
  standalone: true,
  imports: [
    CommonModule,
    OnlineStoresComponent,
    OnsiteStoresComponent,
    NgxSegmentedControlComponent,
    SocialStoresComponent,
    AssetSectionComponent,
    HeaderBackgroundDirective,
    NgxButtonComponent,
    PipesModule,
    AssetPreviewMiniComponent,
    DpIconComponent,
    AnimatedListComponent,
    AnimatedListDirective,
    NgxIcon,
    NgxStatusLightComponent,
    NgxRouterLoadingDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [ScrollAnimationService, NgxNoticeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit, AfterViewInit {
  protected readonly AssetCategoriesEnum = AssetCategoriesEnum;
  // Injections
  backHandler = inject(BackHandlerService);
  bannersApiService = inject(BannersApiService);
  promotionApiService = inject(PromotionApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  location = inject(Location);
  disasterService = inject(DisasterLevelService);
  geoEntityService = inject(GeoEntityService);
  layoutService = inject(LayoutService);
  locationService = inject(LocationService);
  noticeService = inject(NgxNoticeService);
  eventManagementService = inject(EventManagementService);
  ngxBottomSheetService = inject(NgxBottomSheetService);
  performanceTierService = inject(PerformanceTierService);
  initiatorService = inject(InitiatorService);
  scrollAnimationService = inject(ScrollAnimationService);
  private el = inject(ElementRef);
  actionHandler = inject(ActionHandlerService);
  messageManagementService = inject(MessageManagementService);
  private destroyRef = inject(DestroyRef);
  socialService = inject(SocialService);
  campaignService = inject(CampaignService);
  storeService = inject(StoresService);

  // Variables
  protected readonly StatusLightSizesEnum = StatusLightSizesEnum;
  protected readonly StatusLightColorsEnum = StatusLightColorsEnum;
  protected readonly StatusLightBordersEnum = StatusLightBordersEnum;
  headerLimited = computed(() => this.performanceTierService.tier() === 'low');
  selectedTab = computed(() => this.tabOptions.find((t) => t.value === this.mode()) ?? this.tabOptions[0]);
  hideAssets = computed(() => this.disasterService.hideAssets());
  bannersData = computed<Banner[]>(() => this.extractUserBanners());
  hasNewMessage = computed(() => this.messageManagementService.hasNewMessage());
  mode = signal<'online' | 'onsite' | 'social'>('online');
  allBannersData = signal<Banner[]>([]);
  geoEntitiesBanner = signal<{ [key: string]: boolean }>({});
  geoEntitiesSlide = signal<{ [key: string]: boolean }>({});
  promotionGroups = signal<Array<PromotionGroupInterface>>([]);
  canLoadOnSiteStores = signal(false);
  @ViewChild('promotionNoticeContent') promotionNoticeContent!: TemplateRef<any>;
  activeCampaign = computed(() => this.campaignService.activeCampaign());
  tabOptions: SegmentItemsModel[] = [
    {
      id: 0,
      text: 'آنلاین',
      value: 'online',
    },
    {
      id: 1,
      text: 'حضوری',
      value: 'onsite',
    },
    {
      id: 2,
      text: 'اینستاگرام',
      value: 'social',
    },
  ];

  searchBarAnimatedList = [
    {
      title: 'جست‌وجو در فروشگاه‌ها',
      icon: 'search',
      iconClass: 'text-onback-high',
      iconSize: '20px',
      iconType: 'linear',
    },
    {
      title: 'لپ‌تاپ، موبایل، ساعت هوشمند',
      icon: 'digital-device',
      iconClass: 'text-onback-warning',
      iconSize: '20px',
      iconType: 'linear',
    },
    {
      title: 'تیشرت، کفش چرم، پالتو',
      icon: 'coat-hanger',
      iconClass: 'text-onback-brand',
      iconSize: '20px',
      iconType: 'linear',
    },
    {
      title: 'سرخ‌کن، یخچال فریزر، جاروبرقی',
      icon: 'home',
      iconClass: 'text-onback-success',
      iconSize: '20px',
      iconType: 'linear',
    },
  ];

  ngOnInit(): void {
    if (!this.initiatorService.initialized()) {
      this.initiatorService.initiate();
    }
    this.getUserLocation();
    this.getBanners();
    this.getPromotionGroups();
    this.changeModeBasedOnQueryParam();
    this.changeQueryParamBasedOnMode();
  }

  getUserLocation(): void {
    this.locationService.getGuaranteedLocation(false, this.storeService.ttlForOptionalLocation).subscribe(() => this.getGeoEntity());
  }

  ngAfterViewInit(): void {
    this.initAssetsScrollAnimation();
    this.handleNoticePromotions();
    this.getMessages();
  }

  private getMessages(isDeleteCache = false): void {
    this.messageManagementService.getMessages(isDeleteCache).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private initAssetsScrollAnimation(): void {
    const container = document.getElementById('dpx-main-layout-body');
    const assets = this.el.nativeElement.querySelector('.store-assets');
    const miniAssets = this.el.nativeElement.querySelector('.store-assets-mini');
    const appHeaderTail = this.el.nativeElement.querySelector('.app-header-tail');

    const fadeOutConfig: ScrollAnimationConfig = {
      scrollFrom: 0,
      scrollTo: 100,
      start: { opacity: '1' },
      end: { opacity: '0' },
    };
    const fadeInConfig: ScrollAnimationConfig = {
      scrollFrom: 100,
      scrollTo: 200,
      start: { opacity: '0', transform: 'translateY(-12px)' },
      end: { opacity: '1', transform: 'translateY(0px)' },
    };
    if (container && assets && miniAssets && appHeaderTail) {
      this.scrollAnimationService.applyAnimation(container, assets, fadeOutConfig, 'fadeOutAssets');
      this.scrollAnimationService.applyAnimation(container, miniAssets, fadeInConfig, 'fadeInMiniAssets');
    }
  }

  private getBanners(): void {
    this.bannersApiService.getBanners().subscribe({
      next: (result) => {
        this.allBannersData.set(result.banners);
      },
    });
  }

  extractUserBanners(): Banner[] {
    return this.allBannersData()
      .filter((banner) => {
        if (!banner.geoRestricted) {
          return true;
        }
        return this.geoEntitiesBanner()[banner.uuid];
      })
      .map((banner) => {
        const newSlides = banner.slides.filter((slide) => {
          if (!slide.geoRestricted) {
            return true;
          }
          return this.geoEntitiesSlide()[slide.uuid];
        });
        return { ...banner, slides: newSlides };
      });
  }

  goToSearch(): void {
    this.router.navigate(['/stores/search']);
  }

  getPromotionGroups(): void {
    this.promotionApiService.getPromotionGroupList().subscribe({
      next: (promotions) => {
        this.promotionGroups.set(promotions);
      },
    });
  }

  changeQueryParamBasedOnMode(): void {
    this.router.navigate(['/stores'], { queryParams: { mode: this.mode() }, replaceUrl: true, queryParamsHandling: 'merge' });
  }

  changeModeBasedOnQueryParam(): void {
    const mode = this.route.snapshot.queryParams['mode'];
    if (mode === 'onsite') {
      this.mode.set('onsite');
      this.canLoadOnSiteStores.set(true);
    } else if (mode === 'online') {
      this.mode.set('online');
    } else if (mode === 'social') {
      this.mode.set('social');
    } else {
      this.mode.set('online');
    }
  }

  changeStoresMode(event: SegmentItemsModel) {
    this.canLoadOnSiteStores.set(true);
    let mode: 'online' | 'onsite' | 'social' = 'online';
    if (event.value === 'onsite') {
      mode = 'onsite';
    } else if (event.value === 'social') {
      mode = 'social';
      this.socialService.sendClickEvent("'stores-social-tab'");
    }
    this.mode.set(mode);
    this.changeQueryParamBasedOnMode();
    this.layoutService.scrollToTop();
  }

  private getGeoEntity(): void {
    this.geoEntityService.getHashMapOfClassName(['banner', 'slide']).subscribe({
      next: (res) => {
        this.geoEntitiesBanner.set(res['banner'] || {});
        this.geoEntitiesSlide.set(res['slide'] || {});
      },
    });
  }

  onScanClick() {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['stores'],
      data: {
        target: 'qr-scanner',
      },
    });
    this.ngxBottomSheetService.openBottomSheet(OfflineSheetOptionComponent, { resource: 'stores' });
  }

  onMessageClicked(): void {
    this.router
      .navigate(['inbox'], {
        queryParams: {
          referer: 'stores',
        },
      })
      .then();
  }

  handleNoticePromotions(): void {
    if (Date.now() < 1758640835000 || localStorage.getItem('seen-filimo-promotion-0407') || Date.now() > 1758713400000) {
      return;
    }
    setTimeout(() => {
      localStorage.setItem('seen-filimo-promotion-0407', 'seen');
      this.noticeService.openModal({
        template: this.promotionNoticeContent,
        position: 'bottom-center',
        context: {
          fullWidth: true,
        },
      });
    }, 1000);
  }

  onPromotionCta(): void {
    this.eventManagementService.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: 'https://www.filimo.com',
          to: 'https://www.filimo.com/digipay',
        },
        meta: '',
        breadCrumbs: ['stores'],
      },
      true,
    );
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: 'https://www.filimo.com/digipay',
        params: {
          'dp-source': 'DP',
          'dp-medium': 'banner',
          'dp-campaign': 'jacalmultiselc',
        },
      },
    });
  }

  closePromotion() {
    this.noticeService.closeModal();
  }
}
