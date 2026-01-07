import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedCommonBannersComponent } from '@client-monorepo/libs/shared/common/banners';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ShoppingGuidePromotionComponent } from '../shopping-guide-promotion/shopping-guide-promotion.component';
import { PersonalizedOnsiteStoresComponent } from '../personalized-onsite-stores/personalized-onsite-stores.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Banner, BannerCategory } from '@client-monorepo/common/utilities';

@Component({
  selector: 'stores-applet-onsite-stores',
  standalone: true,
  imports: [
    CommonModule,
    SharedCommonBannersComponent,
    NgxButtonComponent,
    ShoppingGuidePromotionComponent,
    PersonalizedOnsiteStoresComponent,
    NgxSkeletonLoadingComponent,
  ],
  templateUrl: './onsite-stores.component.html',
  styleUrl: './onsite-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnsiteStoresComponent {
  BannerCategory = BannerCategory;
  bannersData = input<Banner[]>([]);

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  goToMap() {
    this.router.navigate(['map'], { relativeTo: this.activatedRoute }).then();
  }
}
