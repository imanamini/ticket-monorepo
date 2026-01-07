import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesMiniViewComponent } from '../categories-mini-view/categories-mini-view.component';
import { SharedCommonBannersComponent } from '@client-monorepo/libs/shared/common/banners';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { Router } from '@angular/router';
import { AuctionBannerComponent } from '../auction-banner/auction-banner.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CampaignBannerComponent, CampaignService } from '@client-monorepo/campaign';
import { DeferPlaceHolderComponent } from '@client-monorepo/common/ui-components';
import { AbTestService, Banner, BannerCategory } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { DeferredService } from '@client-monorepo/stores';

@Component({
  selector: 'stores-applet-online-stores',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesMiniViewComponent,
    SharedCommonBannersComponent,
    AuctionBannerComponent,
    NgxSpinnerModule,
    CampaignBannerComponent,
    DeferPlaceHolderComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './online-stores.component.html',
  styleUrl: './online-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnlineStoresComponent implements OnInit, OnDestroy {
  bannersData = input<Banner[]>([]);
  backHandler = inject(BackHandlerService);
  campaignService = inject(CampaignService);
  deferredService = inject(DeferredService);
  router = inject(Router);
  isAuctionMode = CampaignService.isAuctionMode();
  activeCampaign = computed(() => this.campaignService.activeCampaign());
  BannerCategory = BannerCategory;
  orderedOnlineBanners = computed(() => this.deferredService.orderedGroupedOnlineBanners());
  removeBannerInLastGroup = 0;
  loadingNewBanner = computed(() => this.deferredService.loadingNewBanner());
  newBannersMode = AbTestService.showNewBannersMode();
  constructor() {
    const eff = effect(
      () => {
        if (this.bannersData().length === 0) return;
        this.deferredService.computeOrderedGroupedOnlineBanners(this.bannersData());
        eff.destroy();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.deferredService.subscribeOnScrollEvent();
  }

  protected renderNewBannersConditionally(removedCount: number) {
    if (removedCount > this.deferredService.groupsPattern[this.deferredService.groupsPattern.length - 1] + this.removeBannerInLastGroup) {
      this.removeBannerInLastGroup = removedCount;
      this.deferredService.scrollEnd();
    }
  }

  ngOnDestroy(): void {
    this.deferredService.resetState();
  }
}
