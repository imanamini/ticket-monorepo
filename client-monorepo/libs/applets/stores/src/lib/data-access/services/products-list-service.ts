import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ProductListPageConfig } from '../constants/plp-config';
import { ProductInterface, ProductSortOptionsTitles, ProductsSortAndFilterService, StoresApiService } from '@client-monorepo/stores';
import {
  PromotionApiService,
  PromotionGroupInterface,
  PromotionGroupTypeEnum,
  PromotionItemRestrictionEnum,
} from '@client-monorepo/common/promotions';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { map, Subject, takeUntil } from 'rxjs';
import { RequestTypeEnum, RestrictionTypes } from '@client-monorepo/common/network';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getHostname } from '@client-monorepo/common/utilities';
import { ProductListDiscountConfig } from '../models/product-list-discount-config';

@Injectable({
  providedIn: 'root',
})
export class ProductsListService {
  config = signal<ProductListPageConfig | undefined>(undefined);
  initialized = signal<boolean>(false);
  isLastPage = signal(false);
  products = signal<ProductInterface[] | undefined>(undefined);
  productsLoading = signal(true);
  public searchText = signal<string>('');
  promotionId = signal<string>('');
  promotionGroup = signal<PromotionGroupInterface | null>(null);
  currentPage = 0;
  pageSize = 10;
  storeTitle = '';
  discountConfig = signal<ProductListDiscountConfig | undefined>(undefined);

  storeApi = inject(StoresApiService);
  promotionService = inject(PromotionApiService);
  eventManagement = inject(EventManagementService);
  actionHandler = inject(ActionHandlerService);
  untilDestroy = inject(DestroyRef);
  private cancelPreviousRequest$ = new Subject<void>();

  sortAndFilterService = inject(ProductsSortAndFilterService);

  sort = computed(() => {
    return this.sortAndFilterService.data().sort;
  });
  filters = computed(() => {
    return this.sortAndFilterService.data().filters;
  });

  initializePageConfig(): void {
    if (this.promotionId() !== '') {
      this.promotionService.getPromotionGroup(this.promotionId()).subscribe({
        next: (res) => {
          if (res?.productsStat && res.productsStat.price) {
            this.sortAndFilterService.setPriceFacet(res.productsStat.price.min, res.productsStat.price.max);
          }
          this.promotionGroup.set(res);
          this.config.set({
            title: res?.title as string,
            query: 'app/store/promotion/item/search?',
            mode: 'promotions',
          });
          this.loadProducts();
        },
      });
    } else if (this.storeTitle !== '') {
      this.config.set({
        title: this.storeTitle,
        query: 'app/store/search?',
        mode: 'products',
      });
      this.getStoreWebsite();
    } else {
      this.config.set({
        title: (this.discountConfig()?.aiCategory as string) + ' تا ' + '%' + this.discountConfig()?.max + ' تخفیف',
        query: 'app/store/search?',
        mode: 'discount',
      });
      this.loadProducts();
    }
  }

  getStoreWebsite(): void {
    this.storeApi
      .getStore(this.config()?.title as string)
      .pipe(map((store) => store?.url))
      .subscribe({
        next: (website) => {
          this.config.set({
            title: this.config()?.title as string,
            query: (this.config()?.query + 'host=' + website) as string,
            mode: 'products',
          });
          this.loadProducts();
        },
      });
  }

  generateBody() {
    let restrictions: any[] = [];
    const mode = this.config()?.mode;
    if (mode === 'products') {
      restrictions = restrictions.concat(this.filters());
      this.config.set({
        ...this.config()!,
        body: {
          orders: this.sort()?.title === ProductSortOptionsTitles.MOST_RELEVANT ? [] : [this.sort()],
          restrictions,
        },
      });
    } else if (mode === 'promotions') {
      if (this.promotionId()) {
        restrictions.push({
          field: PromotionItemRestrictionEnum.GROUPID,
          operation: 'eq',
          type: RestrictionTypes.SIMPLE,
          value: this.promotionId(),
        });
      }
      restrictions = restrictions.concat(this.filters());
      this.config.set({
        ...this.config()!,
        body: {
          orders: this.sort()?.title === ProductSortOptionsTitles.MOST_RELEVANT ? [] : [this.sort()],
          restrictions,
        },
      });
    } else if (mode === 'discount') {
      restrictions.push({
        field: 'discountPercent',
        type: RestrictionTypes.RANGE,
        minValue: this.discountConfig()?.min,
        maxValue: this.discountConfig()?.max,
      });
      if (this.discountConfig()?.aiCategory) {
        restrictions.push({
          field: 'aiCategoryName',
          type: RestrictionTypes.COLLECTION,
          values: this.discountConfig()?.aiCategory?.split('_'),
        });
      }
      if (this.discountConfig()?.storeIds) {
        restrictions.push({
          field: 'hostName',
          type: RestrictionTypes.COLLECTION,
          values: this.discountConfig()?.storeIds?.split('_'),
        });
      }
      restrictions = restrictions.concat(this.filters());
      this.config.set({
        ...this.config()!,
        title: this.discountConfig()?.title as string,
        body: {
          orders: this.sort()?.title === ProductSortOptionsTitles.MOST_RELEVANT ? [] : [this.sort()],
          restrictions,
        },
      });
    }
  }

  loadProducts(): void {
    this.cancelPreviousRequest$.next();
    this.productsLoading.set(true);
    if (this.config()?.query) {
      const submittedQuery = this.createQuery();
      this.generateBody();
      const method = this.config()?.body ? RequestTypeEnum.POST : RequestTypeEnum.GET;
      this.storeApi
        .getProductsBasedOnQuery(submittedQuery, method, this.config()?.body)
        .pipe(takeUntilDestroyed(this.untilDestroy))
        .pipe(takeUntil(this.cancelPreviousRequest$))
        .subscribe({
          next: (data) => {
            this.products.update((ex) => {
              if (ex) {
                return ex.concat(data);
              } else {
                return data;
              }
            });
            this.initialized.set(true);
            if (data.length < this.pageSize) {
              this.isLastPage.set(true);
            }
            this.productsLoading.set(false);
          },
        });
    }
  }

  createQuery(): string {
    let prefix = '?';
    if (this.config()?.query?.includes('?')) {
      prefix = '&';
    }
    let query = this.config()?.query + `${prefix}page=${this.currentPage}&size=${this.pageSize}&available=true`;
    if (this.searchText()) {
      query += `&keyword=${this.searchText()}`;
    }
    return query;
  }

  loadNewPage(): void {
    if (!this.isLastPage() && this.initialized() && this.products() && this.products()!.length > 0) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToProductPage(product: ProductInterface) {
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        meta: '',
        breadCrumbs: ['products-list', 'product'],
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
          'dp-medium':
            this.config()?.mode === 'promotions' && this.promotionGroup()
              ? this.promotionGroup()?.type === PromotionGroupTypeEnum.NORMAL
                ? 'normal-carousel'
                : 'amazing-carousel'
              : 'merchant',
          'dp-type': 'product',
          'dp-campaign': this.promotionGroup()?.title || '',
        },
      },
    });
  }

  searchEnd(event: any) {
    this.sortAndFilterService.resetSortAndFilter();
    this.searchText.set(event);
    this.reloadProducts();
  }

  reloadProducts(): void {
    this.products.set([]);
    this.currentPage = 0;
    this.isLastPage.set(false);
    this.loadProducts();
  }

  resetSortAndFilter(): void {
    this.sortAndFilterService.resetSortAndFilter();
  }

  resetAllStates(): void {
    this.products.set([]);
    this.currentPage = 0;
    this.isLastPage.set(false);
    this.config.set(undefined);
    this.initialized.set(false);
    this.productsLoading.set(true);
    this.searchText.set('');
    this.promotionId.set('');
    this.promotionGroup.set(null);
    this.storeTitle = '';
    this.discountConfig.set(undefined);
  }
}
