import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RecentlyViewedProduct,
  RecentlyViewedStore,
  RecentlyViewedService,
  StorePreviewComponent,
  ProductPreviewComponent,
} from '@client-monorepo/stores';
import { Router } from '@angular/router';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { getHostname, SafePressDirective } from '@client-monorepo/common/utilities';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'common-stores-recently-viewed',
  standalone: true,
  imports: [
    CommonModule,
    TitleSummaryComponent,
    StorePreviewComponent,
    ProductPreviewComponent,
    SafePressDirective,
    HorizontalScrollComponent,
  ],
  templateUrl: './recently-viewed.component.html',
  styleUrl: './recently-viewed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedComponent implements OnInit {
  private readonly recentlyViewedService = inject(RecentlyViewedService);
  private readonly router = inject(Router);
  private readonly eventManagement = inject(EventManagementService);
  private readonly actionHandler = inject(ActionHandlerService);

  nothingToShow = output<boolean>();

  groupedRecentlyViewedProducts = signal<RecentlyViewedProduct[][] | any>([]);
  recentlyViewedStores = signal<RecentlyViewedStore[] | any>([]);

  hasProducts = computed(() => this.groupedRecentlyViewedProducts().length > 0);
  hasStores = computed(() => this.recentlyViewedStores().length > 0);
  hasAnyItems = computed(() => this.hasProducts() || this.hasStores());

  ngOnInit(): void {
    this.loadRecentlyViewed();
  }

  private loadRecentlyViewed(): void {
    const recentlyViewedProducts = this.recentlyViewedService.getRecentlyViewedProducts();
    if (recentlyViewedProducts.length > 1) {
      this.groupedProducts(recentlyViewedProducts);
    }
    const recentlyStores = this.recentlyViewedService.getRecentlyViewedStores();
    if (recentlyStores.length > 1) {
      this.recentlyViewedStores.set(recentlyStores);
    }

    if (!this.hasAnyItems()) {
      this.nothingToShow.emit(true);
    }
  }

  groupedProducts(products: RecentlyViewedProduct[]): void {
    const grouped: RecentlyViewedProduct[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      const newRow = [products[i]];
      if (products[i + 1]) newRow.push(products[i + 1]);
      grouped.push(newRow);
    }
    this.groupedRecentlyViewedProducts.set(grouped);
  }

  goToProduct(product: RecentlyViewedProduct): void {
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        meta: '',
        breadCrumbs: ['recently-viewed', 'product'],
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
          'dp-medium': 'merchant',
          'dp-type': 'product',
        },
      },
    });
  }

  goToStore(store: RecentlyViewedStore): void {
    this.router.navigate(['/stores', store.trackingCode]);
  }
}
