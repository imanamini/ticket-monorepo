import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  StoreCategory,
  StoreCategoryDiscountMapper,
  StoreCategoryTitle,
  StoreCategoryTitleMapper,
  StoresApiService,
} from '@client-monorepo/stores';
import { CategoryImageComponent, HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Router } from '@angular/router';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CampaignService } from '@client-monorepo/campaign';

@Component({
  selector: 'stores-applet-categories-mini-view',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    HorizontalScrollComponent,
    ApiImageModule,
    NgxSkeletonLoadingComponent,
    CategoryImageComponent,
    NgxBadgeModule,
  ],
  templateUrl: './categories-mini-view.component.html',
  styleUrl: './categories-mini-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesMiniViewComponent implements OnInit {
  mode = input<'old' | 'new'>('old');
  backgroundClass = input<'surface-back' | 'surface-elevated' | 'surface-glass-onback'>('surface-elevated');
  categories = signal<StoreCategory[] | undefined>(undefined);
  rangeCreator = rangeCreator;
  storeCategoryTitleMapper = StoreCategoryTitleMapper;
  storeCategoryDiscountMapper = StoreCategoryDiscountMapper;
  storesApi = inject(StoresApiService);
  router = inject(Router);
  auctionMode = CampaignService.isAuctionMode();

  ngOnInit(): void {
    this.getStoresCategories();
  }

  getStoresCategories(): void {
    this.storesApi.getAllCategories().subscribe({
      next: (res) => this.categories.set(res),
      error: () => this.categories.set([]),
    });
  }

  gotoFiltersBasedOnCategory(title: StoreCategoryTitle): void {
    this.router.navigate(['/stores/all-stores'], { queryParams: { categories: title } });
  }
}
