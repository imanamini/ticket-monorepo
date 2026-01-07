import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInterface, ProductPreviewComponent, Store, StoresApiService } from '@client-monorepo/stores';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';

@Component({
  selector: 'stores-applet-store-products',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, HorizontalScrollComponent, ProductPreviewComponent],
  templateUrl: './store-products.component.html',
  styleUrl: './store-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreProductsComponent implements OnInit {
  store = input.required<Store>();
  products = signal<ProductInterface[] | undefined>(undefined);
  storeApi = inject(StoresApiService);
  router = inject(Router);
  eventManagement = inject(EventManagementService);
  actionHandler = inject(ActionHandlerService);

  ngOnInit(): void {
    this.getStoreProducts();
  }

  getStoreProducts(): void {
    if (this.store()?.url) {
      this.storeApi.getStoreProducts(this.store()?.url as string).subscribe({
        next: (data) => {
          this.products.set(data.products);
        },
      });
    }
  }

  goToProductList(): void {
    this.router.navigate(['stores/products/' + this.store()?.title]);
  }

  goToProductPage(product: ProductInterface) {
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: this.store()?.url as string,
          to: product.url,
        },
        meta: `storeTrackingCode:${this.store().trackingCode}`,
        breadCrumbs: ['stores-applet-products-list', 'product'],
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
}
