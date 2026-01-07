import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInterface, ProductPreviewComponent, Store, StoresApiService } from '@client-monorepo/stores';
import { Router } from '@angular/router';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { OrderTypes, RequestTypeEnum, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { HorizontalScrollComponent, SectionComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { rangeCreator } from '@client-monorepo/common/utilities';

@Component({
  selector: 'stores-applet-store-discounted-products',
  standalone: true,
  imports: [CommonModule, SectionComponent, SectionComponent, TitleSummaryComponent, HorizontalScrollComponent, ProductPreviewComponent],
  templateUrl: './store-discounted-products.component.html',
  styleUrl: './store-discounted-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDiscountedProductsComponent implements OnInit {
  store = input.required<Store>();
  products = signal<ProductInterface[] | undefined>(undefined);
  storeApi = inject(StoresApiService);
  router = inject(Router);
  eventManagement = inject(EventManagementService);
  actionHandler = inject(ActionHandlerService);

  isLoading = computed(() => !this.products());

  ngOnInit(): void {
    this.getDiscountedProducts();
  }

  getDiscountedProducts(): void {
    const body: SearchPayloadInterface<string> = {
      orders: [
        {
          field: 'discountPercent',
          order: OrderTypes.DESC,
        },
      ],
      restrictions: [
        {
          field: 'hostName',
          type: RestrictionTypes.SIMPLE,
          value: this.store().url,
          operation: 'eq',
        },
        {
          field: 'discountPercent',
          type: RestrictionTypes.SIMPLE,
          value: 0,
          operation: 'gt',
        },
      ],
    };
    if (this.store()?.url) {
      this.storeApi.getProductsBasedOnQuery('app/store/search?available=true', RequestTypeEnum.POST, body).subscribe({
        next: (data) => {
          this.products.set(data);
        },
        error: () => this.products.set([]),
      });
    } else {
      this.products.set([]);
    }
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
        breadCrumbs: ['store-details-discounted', 'product'],
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

  goToProductList() {
    this.router.navigate(['stores/products/' + this.store()?.title], { queryParams: { sort: 'DISCOUNT' } });
  }

  protected readonly rangeCreator = rangeCreator;
}
