import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { PromotionApiService, PromotionItemRestrictionEnum } from '@client-monorepo/common/promotions';
import { finalize, Observable, switchMap } from 'rxjs';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import {
  PromotionItemsSearchResponseInterface
} from '@client-monorepo/common/promotions';
import { PromotionItemInterface } from '@client-monorepo/common/promotions';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgOptimizedImage } from '@angular/common';
import { Banner, PerformanceTierService, shuffleArray } from '@client-monorepo/common/utilities';
import { SocialProductEventPrefix, SocialService } from '@client-monorepo/social';
import { Router } from '@angular/router';

@Component({
  selector: 'common-app-banners-post-carousel-banner',
  standalone: true,
  templateUrl: './post-carousel-banner.component.html',
  imports: [
    TitleSummaryComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    NgxSkeletonLoadingComponent,
    NgOptimizedImage
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostCarouselBannerComponent implements OnInit {
  promotionApiService = inject(PromotionApiService);
  performanceTierService = inject(PerformanceTierService);
  router = inject(Router);
  socialService = inject(SocialService);

  banner = input.required<Banner>();
  shouldCautiousAboutPerformance = input(false);
  nothingToShow = output<boolean>();

  promotionGroupId = computed<string>(() => this.banner()?.extractedConfig?.promotionGroup);

  isLoading = signal(false);
  activeIndex = signal<number>(0);
  isSwiping = signal(false);
  isAnimating = signal(false);
  promotionItems = signal<PromotionItemInterface[]>([]);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');
  itemGroups = computed(() => {
    const shuffle = shuffleArray(this.promotionItems());
    const output: PromotionItemInterface[][] = [];
    for (let i = 0; i + 6 <= shuffle.length; i += 6) {
      output.push(this.promotionItems().slice(i, i + 6));
    }
    return output;
  });


  ngOnInit(): void {
    this.getPromotionItems();
  }

  getPromotionItems(): void {
    this.isLoading.set(true);
    this.promotionApiService
      .getPromotionGroup(this.promotionGroupId())
      .pipe(
        switchMap((promotionGroup) => {
          if (promotionGroup) {
            const payload: SearchPayloadInterface<PromotionItemRestrictionEnum> = {
              page: 0,
              size: 10,
              orders: [
                {
                  field: 'order',
                  order: OrderTypes.ASC
                }
              ],
              restrictions: [
                {
                  type: RestrictionTypes.SIMPLE,
                  field: PromotionItemRestrictionEnum.GROUPID,
                  operation: 'eq',
                  value: this.promotionGroupId()
                },
                {
                  type: RestrictionTypes.SIMPLE,
                  field: PromotionItemRestrictionEnum.CONTENT_TYPE,
                  operation: 'eq',
                  value: 1
                }
              ]
            };
            return this.promotionApiService.getPromotionItemsList(payload);
          } else {
            return new Observable<null>((observer) => {
              observer.next(null);
              observer.complete();
            });
          }
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (promotionsItems: PromotionItemsSearchResponseInterface | null) => {
          if (promotionsItems && Array.isArray(promotionsItems.items) && promotionsItems.items.length > 6) {
            this.promotionItems.set(promotionsItems.items);
          } else {
            this.nothingToShow.emit(true);
          }
        }
      });
  }

  handleSwiping(event: boolean): void {
    this.isSwiping.set(event);
  }

  handleAnimating(event: boolean): void {
    this.isAnimating.set(event);
  }

  handlePostClicked(post: PromotionItemInterface): void {
    if (this.isSwiping() || this.isAnimating()) {
      return;
    }
    this.socialService.sendClickEvent(SocialProductEventPrefix + post.instagramPost.postId);
    this.router.navigate(['stores', 'social', 'post', post.instagramPost.postId]);
  }
}
