import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Action, ActionHandlerService, ActionType, RedirectAction } from '@client-monorepo/common/action-handler';
import { PromotionListComponent } from '@client-monorepo/common/promotions';
import { SectionTypeBannerComponent } from '../section-type-banner/section-type-banner.component';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { PartialViewCarouselBannerComponent } from '../partial-view-carousel-banner/partial-view-carousel-banner.component';
import { VoucherCarouselComponent } from '@client-monorepo/vouchers';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { EventManagementService, ThirdPartyTrackerService } from '@client-monorepo/common/event-management';
import {
  Banner,
  BannerCategory,
  getHostname,
  PerformanceTierService,
  SimpleImageSlide,
  Slide,
  SlideData,
} from '@client-monorepo/common/utilities';
import { SocialNewStoresComponent, SocialPopularPostsComponent } from '@client-monorepo/social';
import { TimerBannerComponent } from '../timer-banner/timer-banner.component';
import { PostCarouselBannerComponent } from '../post-carousel-banner/post-carousel-banner.component';
import { MallCarouselBannerComponent } from '../mall-carousel-banner/mall-carousel-banner.component';
import {
  AllStoresSectionComponent,
  CategoryStoresComponent,
  RecentlyViewedComponent,
  StandAloneProductListComponent,
  ThirdPartyCarouselComponent,
} from '@client-monorepo/stores';
import { TopMerchantCarouselComponent } from '../top-merchant-carousel/top-merchant-carousel.component';

@Component({
  selector: 'common-app-banners-shared-common-banners',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    PromotionListComponent,
    SectionTypeBannerComponent,
    HorizontalScrollComponent,
    TitleSummaryComponent,
    PartialViewCarouselBannerComponent,
    VoucherCarouselComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    SocialPopularPostsComponent,
    TimerBannerComponent,
    SocialNewStoresComponent,
    MallCarouselBannerComponent,
    AllStoresSectionComponent,
    ThirdPartyCarouselComponent,
    CategoryStoresComponent,
    RecentlyViewedComponent,
    StandAloneProductListComponent,
    TopMerchantCarouselComponent,
    PostCarouselBannerComponent,
  ],
  templateUrl: './shared-common-banners.component.html',
  styleUrl: './shared-common-banners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.d-none]': 'hideBanners()' },
})
export class SharedCommonBannersComponent {
  // Injections
  actionHandler = inject(ActionHandlerService);
  thirdPartyTrackerService = inject(ThirdPartyTrackerService);
  eventManagementService = inject(EventManagementService);

  // Inputs
  deferredBanners = input<Banner[] | undefined>(undefined);
  bannersData = input<Banner[]>([]);
  categoryToShow = input<BannerCategory>();
  skeletonHeight = input<number>(186);
  isCarouselAnimationRunning = signal<boolean>(false);
  carouselIndex = signal<number>(0);
  singleBannerClasses = signal<string>('px-plus');
  carouselGap = input<number>(40);
  nothingToShow = signal<{ [key: number]: boolean }>({});
  gapClass = input<string | null>(null);
  bannerRoute = input<'hub' | 'stores' | 'search' | 'store-detail' | 'all'>('all');
  hideBanners = computed(() => {
    if (this.deferredBanners()) return false;
    if (!this.bannersToShow().length) {
      return true;
    }
    return Object.values(this.nothingToShow()).filter((item) => item).length === this.bannersToShow().length;
  });

  // Variables
  bannersToShow = computed<Banner[]>(() => this.deferredBanners() ?? this.decideForDisplay());
  trackerBanners = viewChildren<ElementRef<HTMLDivElement>>('trackerBanner');

  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');

  removeBannersCount = signal(0);
  removeBannersCountOutput = output<number>();
  constructor() {
    effect(() => {
      if (this.trackerBanners().length) {
        this.trackerBanners().forEach((item) => {
          if (!item.nativeElement) {
            return;
          }
          const ids = item.nativeElement.dataset['id']?.split('|');
          if (!ids || ids.length !== 2) {
            return;
          }
          const bannerId = ids[0];
          const slideId = ids[1];
          const banner = this.bannersToShow().find((item) => item.uuid === bannerId);
          const slide = banner?.slides.find((slide) => slide.uuid === slideId) as SimpleImageSlide;
          const creativeName = slide && slide.extractedData?.marketingId;
          if (!banner || !slide || !creativeName) {
            return;
          }
          this.thirdPartyTrackerService.observeViewElementAndSendEvent(
            item.nativeElement,
            'view_promotion',
            this.generateTrackingData(banner, slide),
            bannerId + '|' + slideId,
          );
        });
      }
    });
  }

  generateTrackingData(banner: Banner, slide: SimpleImageSlide) {
    return {
      promotion_id: banner.uuid + '|' + slide.uuid,
      promotion_name: banner?.title,
      creative_name: slide && slide.extractedData?.marketingId,
      creative_slot: banner?.type,
      location_id: this.categoryToShow() + banner?.order + slide.order,
    };
  }

  decideForDisplay(): Banner[] {
    if (!(this.bannersData().length > 0)) {
      return [];
    }
    const category = this.categoryToShow();
    if (!category) return [];
    const isPresent = this.bannersData().find((banner) => banner.categories.includes(category));
    if (isPresent) {
      return this.generateBannersToShow();
    } else {
      return [];
    }
  }

  handleSlideClick(action: Action | undefined, slide: Slide, banner: Banner): void {
    if (!action || this.isCarouselAnimationRunning()) {
      return;
    }
    if (action.type === ActionType.REDIRECT) {
      action = action as RedirectAction;
      action = {
        ...action,
        payload: {
          ...action.payload,
          params: {
            ...(action.payload.params ?? {}),
            'dp-source': 'DP',
            'dp-medium': 'banner',
            'dp-campaign': slide.extractedData.altText ?? '',
          },
        },
      } as RedirectAction;
      this.triggerRedirectEvent(
        action.payload.url,
        !!action.payload.params['external'],
        banner && slide && (slide as SimpleImageSlide).extractedData?.marketingId,
      );
    }
    if (banner && slide && (slide as SimpleImageSlide).extractedData?.marketingId) {
      this.thirdPartyTrackerService.sendEvent('select_promotion', this.generateTrackingData(banner, slide as SimpleImageSlide));
    }
    this.actionHandler.handle(action);
  }

  triggerRedirectEvent(url: string, external: boolean, marketingId: string): void {
    if (!url.startsWith('http://') && !url.startsWith('https://') && !external) {
      return;
    }
    let hostName = '';
    try {
      hostName = getHostname(url);
    } catch (error) {
      if (error instanceof Error) {
        console.error('getHostname in redirect failed', error);
      } else {
        console.error('getHostname in redirect failed with non-error', error);
      }
    }
    if (!hostName || location?.hostname === hostName) {
      return;
    }
    this.eventManagementService.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          to: url,
          host: hostName,
        },
        meta: `marketingId:${marketingId}`,
        breadCrumbs: ['banner'],
      },
      true,
    );
  }

  handleCarouselIndexChange(index: number): void {
    this.carouselIndex.set(index);
  }

  handleAnimationRunning(event: boolean): void {
    this.isCarouselAnimationRunning.set(event);
  }

  generateBannersToShow(): Banner[] {
    const category = this.categoryToShow();
    if (!category) return [];
    return this.bannersData()
      .filter((banner) => banner.categories.includes(category))
      .sort((a, b) => a.order - b.order)
      .map((item) => {
        let slides = this.generateSlidesExtractedData(item.slides, item.type === 'Carousel' || item.type === 'Partial-View-Carousel');
        if (item.type === 'Carousel' || item.type === 'Partial-View-Carousel') {
          slides = slides.slice(0, 5);
        }
        return {
          ...item,
          extractedConfig: item.config ? JSON.parse(item.config) : undefined,
          slides,
        } as Banner;
      });
  }

  generateSlidesExtractedData(slides: Slide[], randomizeOrder = true): Slide[] {
    return this.sortSlides(slides, randomizeOrder).map((slide) => {
      return {
        ...slide,
        extractedData: JSON.parse(slide.data) as SlideData,
        extractedAction: JSON.parse(slide.action) as Action,
      } as Slide;
    });
  }

  private sortSlides(slides: Slide[], randomizeOrder = false): Slide[] {
    if (!randomizeOrder) {
      return slides.sort((a, b) => a.order - b.order);
    }
    return this.weightedShuffle<Slide>(
      slides,
      slides.map((slide) => slide.order),
    );
  }

  private weightedShuffle<T>(items: T[], weights: number[]): T[] {
    const paired = items.map((item, i) => ({
      item,
      key: Math.pow(Math.random(), 1 / weights[i]),
    }));

    paired.sort((a, b) => a.key - b.key);

    return paired.map((p) => p.item);
  }

  handleNothingToShow(mode: boolean, index: number) {
    this.nothingToShow.update((prev) => {
      return { ...prev, [index]: mode };
    });
    this.increaseNumberOfRemovedBanners();
  }

  protected increaseNumberOfRemovedBanners() {
    this.removeBannersCount.update((ex) => ex + 1);
    this.removeBannersCountOutput.emit(this.removeBannersCount());
  }
}
