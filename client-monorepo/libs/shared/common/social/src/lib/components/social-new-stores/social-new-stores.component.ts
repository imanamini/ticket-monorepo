import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { SocialStorePreviewComponent } from '../social-store-preview/social-store-preview.component';
import { Router } from '@angular/router';
import { SocialApiService, SocialService, SocialStoreEventPrefix, SocialStorePost } from '@client-monorepo/social';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'common-social-new-stores',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    NgxDpCarouselComponent,
    NgxDpCarouselSlideDirective,
    SocialStorePreviewComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './social-new-stores.component.html',
  styleUrl: './social-new-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialNewStoresComponent implements OnInit {
  // Injections
  socialApi = inject(SocialApiService);
  router = inject(Router);
  socialService = inject(SocialService);

  // Inputs
  storeTrackingCodes = input<string[]>();
  title = input<string | undefined>(undefined);

  // Variables
  socialStores = signal<SocialStorePost[] | undefined>(undefined);
  loading = signal(true);
  isSwiping = signal(false);
  isAnimating = signal(false);
  clickDisabled = computed(() => this.isSwiping() || this.isAnimating());
  activeIndex = signal<number>(0);
  selectedStore = signal<SocialStorePost | undefined>(undefined);

  ngOnInit(): void {
    this.getStores();
  }

  getStores(): void {
    this.socialApi.getLatestPosts(this.storeTrackingCodes() as string[]).subscribe({
      next: (res) => {
        this.socialStores.set(res.storePosts);
        this.loading.set(false);
      },
      error: () => {
        this.socialStores.set([]);
        this.loading.set(false);
      },
    });
  }

  handleClickStore(store: SocialStorePost): void {
    this.selectedStore.set(store);
  }

  handleSwiping(event: boolean): void {
    this.isSwiping.set(event);
  }

  handleSingleTap(): void {
    setTimeout(() => {
      if (this.clickDisabled() || !this.selectedStore()) return;
      const trackingCode = this.selectedStore()!.storeTrackingCode;
      this.socialService.sendClickEvent(SocialStoreEventPrefix + trackingCode);
      this.router.navigate(['stores/social/store/' + this.selectedStore()!.storeTrackingCode]);
    }, 0);
  }

  handleAnimating(event: boolean): void {
    this.isAnimating.set(event);
  }
}
