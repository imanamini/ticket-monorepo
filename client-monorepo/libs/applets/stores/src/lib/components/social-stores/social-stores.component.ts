import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannersApiService, SharedCommonBannersComponent } from '@client-monorepo/libs/shared/common/banners';
import { SocialNewStoresComponent } from '@client-monorepo/social';
import { Router } from '@angular/router';
import { ShoppingGuidePromotionComponent } from '../shopping-guide-promotion/shopping-guide-promotion.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Banner, BannerCategory } from '@client-monorepo/common/utilities';

@Component({
  selector: 'stores-applet-social-stores',
  standalone: true,
  imports: [CommonModule, SharedCommonBannersComponent, SocialNewStoresComponent, ShoppingGuidePromotionComponent, NgxButtonComponent],
  templateUrl: './social-stores.component.html',
  styleUrl: './social-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialStoresComponent implements OnInit {
  // Injections
  bannersApiService = inject(BannersApiService);
  router = inject(Router);

  // Variables
  protected readonly BannerCategory = BannerCategory;
  allBannersData = signal<Banner[]>([]);
  bannersData = computed<Banner[]>(() => {
    return this.allBannersData().filter((banner) => !banner.geoRestricted);
  });

  ngOnInit(): void {
    this.getBanners();
  }

  private getBanners(): void {
    this.bannersApiService.getBanners().subscribe({
      next: (result) => {
        this.allBannersData.set(result.banners);
      },
    });
  }

  goToExplore(): void {
    this.router.navigate(['stores', 'social', 'explore']);
  }
}
