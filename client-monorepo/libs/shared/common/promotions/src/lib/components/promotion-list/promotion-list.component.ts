import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionGroupInterface } from '../../data-access/models/promotion-group.interface';
import { PromotionApiService } from '../../data-access/services/promotion-api.service';
import { PromotionGroupTypeEnum } from '../../data-access/models/promotion-group-type.enum';
import { DeferPlaceHolderComponent, HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { PromotionItemInterface } from '../../data-access/models/promotion-item.interface';
import { BannerService, generateUUID, getHostname, PerformanceTierService, rangeCreator } from '@client-monorepo/common/utilities';
import { ProductInterface, ProductPreviewComponent } from '@client-monorepo/stores';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { interval, map, Observable, startWith, Subscription, switchMap, take } from 'rxjs';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { PromotionItemRestrictionEnum } from '../../data-access/models/promotion-item-restriction.enum';
import { PromotionItemsSearchResponseInterface } from '../../data-access/models/promotion-items-search-response.interface';
import { Router, RouterLink } from '@angular/router';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { PromotionModes } from '../../data-access/consts/promotion-modes.enum';
import { CampaignService } from '@client-monorepo/campaign';

@Component({
  selector: 'common-promotions-promotion-list',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    HorizontalScrollComponent,
    ProductPreviewComponent,
    NgxSkeletonLoadingComponent,
    RouterLink,
    NgxButtonComponent,
    ApiImageModule,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    DeferPlaceHolderComponent,
  ],
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.d-none]': '!isLoading() && !promotionItems().length',
    '[style.height]': 'placeHolderHeight()',
  },
})
export class PromotionListComponent implements OnInit, OnDestroy {
  // Injections
  actionHandler = inject(ActionHandlerService);
  promotionApiService = inject(PromotionApiService);
  eventManagement = inject(EventManagementService);
  performanceTierService = inject(PerformanceTierService);
  router = inject(Router);
  campaignService = inject(CampaignService);
  host = inject(ElementRef<HTMLElement>);
  bannerService = inject(BannerService);

  // Inputs
  promotionGroupId = input.required<string>();
  promotionMode = input<PromotionModes>(PromotionModes.CAROUSEL);
  showInstallment = input<boolean>(false);
  shouldCautiousAboutPerformance = input(false);

  // Outputs
  nothingToShow = output<boolean>();

  // Variables
  uniqId = generateUUID();
  protected readonly PromotionModes = PromotionModes;
  promotionGroup = signal<PromotionGroupInterface | undefined>(undefined);
  promotionItems = signal<Array<PromotionItemInterface>>([]);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
  targetTime = computed(() => {
    const items = this.promotionItems().sort((a, b) => {
      return a.endTime - b.endTime;
    });
    return items[0].endTime ? Math.round(items[0].endTime / 1000) : 0;
  });
  gridItems = computed<PromotionItemInterface[]>(() =>
    this.promotionItems()
      .filter((promotion) => {
        const product = promotion.product;
        return product?.available && product?.title && product?.price && product?.image && product?.url;
      })
      .slice(0, 4),
  );
  type = computed(() => {
    return this.promotionGroup()?.type ?? PromotionGroupTypeEnum.NORMAL;
  });
  isLoading = signal(true);
  time = signal<Array<string>>(['00', '00', '00']);
  animationIsRunningVariable = signal(false);
  PromotionGroupTypeEnum = PromotionGroupTypeEnum;
  timerSubscription!: Subscription;
  rangeCreator = rangeCreator;
  activeCampaign = computed(() => this.campaignService.activeCampaign());
  isInViewport = computed(() => {
    if (this.bannerService.isInViewport()) {
      return this.bannerService.isInViewport()[this.uniqId] ?? false;
    }
    return false;
  });
  placeHolderHeight = computed(() => {
    if (this.promotionMode() === PromotionModes.GRID_2X2) return 'auto';
    if (this.type() === PromotionGroupTypeEnum.CIRCULAR_WOW) return '382px';
    if (this.type() === PromotionGroupTypeEnum.SIMPLE_WOW) return '376px';
    else return '326px';
  });

  constructor() {
    effect(() => {
      const length = this.promotionItems().length;
      if (!this.isLoading() && !length) {
        this.nothingToShow.emit(true);
      } else if (!this.isLoading() && this.promotionMode() === PromotionModes.GRID_2X2 && (length < 4 || this.gridItems().length < 4)) {
        this.nothingToShow.emit(true);
      } else {
        this.nothingToShow.emit(false);
      }
    });
  }

  ngOnInit(): void {
    if (this.promotionGroupId()) {
      if (this.bannerService.readFromCache(this.uniqId)) {
        this.promotionItems.set(this.bannerService.readFromCache(this.uniqId));
      } else {
        this.loadPromotionItems();
      }
    }
    if (this.shouldCautiousAboutPerformance()) {
      this.observeIntersection();
    }
  }

  loadPromotionItems(): void {
    this.isLoading.set(true);
    this.timerSubscription?.unsubscribe();
    this.promotionItems.set([]);
    this.promotionGroup.set(undefined);
    if (this.promotionGroupId()) {
      this.promotionApiService
        .getPromotionGroup(this.promotionGroupId())
        .pipe(
          switchMap((promotionGroup) => {
            if (promotionGroup) {
              this.promotionGroup.set(promotionGroup);
              const payload: SearchPayloadInterface<PromotionItemRestrictionEnum> = {
                page: 0,
                size: 10,
                orders: [
                  {
                    field: 'order',
                    order: OrderTypes.ASC,
                  },
                ],
                restrictions: [
                  {
                    type: RestrictionTypes.SIMPLE,
                    field: PromotionItemRestrictionEnum.GROUPID,
                    operation: 'eq',
                    value: this.promotionGroupId(),
                  },
                ],
              };
              return this.promotionApiService.getPromotionItemsList(payload);
            } else {
              return new Observable<null>((observer) => {
                observer.next(null);
                observer.complete();
              });
            }
          }),
        )
        .subscribe({
          next: (promotionsItems: PromotionItemsSearchResponseInterface | null) => {
            if (promotionsItems && Array.isArray(promotionsItems.items) && promotionsItems.items.length) {
              this.promotionItems.set(promotionsItems.items);
              this.initComponent();
            } else {
              this.isLoading.set(false);
            }
          },
        });
    }
  }

  initComponent(): void {
    this.promotionItems.update(() => {
      return this.promotionItems().sort((first: PromotionItemInterface, second: PromotionItemInterface) => {
        return first.endTime - second.endTime;
      });
    });
    const now = Math.floor(Date.now() / 1000);
    this.timerSubscription = this.createCountdown(this.targetTime() - now).subscribe({
      next: (time) => {
        if (Array.isArray(time)) {
          this.time.set(time);
        }
      },
      complete: () => {
        this.timerSubscription?.unsubscribe();
        this.loadPromotionItems();
      },
    });
    this.isLoading.set(false);
    this.bannerService.updateCash(this.uniqId, this.promotionItems());
  }

  createCountdown(seconds: number) {
    return interval(1000).pipe(
      // Convert each tick into the remaining time
      map((count) => this.formatTime(seconds - count - 1)),
      // Start with the initial countdown value
      startWith(seconds),
      // Complete the countdown when it reaches zero
      take(seconds + 1),
    );
  }

  formatTime(totalSeconds: number): string[] {
    let hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    hours = Math.min(hours, 99);
    return [`${String(hours).padStart(2, '0')}`, `${String(minutes).padStart(2, '0')}`, `${String(seconds).padStart(2, '0')}`];
  }

  clickOnItem(product: ProductInterface): void {
    if (this.animationIsRunningVariable()) {
      return;
    }
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        breadCrumbs: ['promotion-list', 'product'],
      },
      true,
    );
    this.actionHandler.handle({
      type: ActionType.REDIRECT,
      payload: {
        type: RedirectionTypeEnum.blank,
        url: product.url,
        params: {
          'dp-source': 'DP',
          'dp-medium': this.type() === PromotionGroupTypeEnum.NORMAL ? 'normal-carousel' : 'amazing-carousel',
          'dp-type': 'product',
          'dp-campaign': this.promotionGroup()?.title || '',
        },
      },
    });
  }

  animationIsRunning(isRunning: boolean) {
    if (!isRunning) {
      setTimeout(() => {
        this.animationIsRunningVariable.set(false);
      }, 200);
    } else {
      this.animationIsRunningVariable.set(true);
    }
  }

  navigate() {
    this.router.navigate([this.promotionGroup()?.uuid ? '/stores/promotions/' + this.promotionGroup()?.uuid : ''], {
      queryParams: this.showInstallment() ? { '4pay': true } : {},
    });
  }

  observeIntersection(): void {
    this.host.nativeElement.setAttribute('id', this.uniqId);
    this.bannerService.initialIntersectionObserver(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
