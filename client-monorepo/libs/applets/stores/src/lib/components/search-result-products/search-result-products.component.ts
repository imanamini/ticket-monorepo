import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  ProductApiService,
  ProductInterface,
  ProductListPayloadInterface,
  ProductPreviewComponent,
  ProductSortOptionsTitles,
  ProductsSortAndFilterComponent,
  ProductsSortAndFilterService,
} from '@client-monorepo/stores';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { Order, Restriction } from '@client-monorepo/common/network';
import { SearchHistoryService } from '../../data-access/services/search-history.service';
import { Subscription } from 'rxjs';
import { getHostname, rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'stores-applet-search-result-products',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, ProductPreviewComponent, ScrolledToEndDirective, ProductsSortAndFilterComponent],
  providers: [DistancePipe],
  templateUrl: './search-result-products.component.html',
  styleUrl: './search-result-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultProductsComponent implements OnInit, OnDestroy {
  protected readonly rangeCreator = rangeCreator;

  // Injections
  productApi = inject(ProductApiService);
  searchHistoryService = inject(SearchHistoryService);
  sortAndFilterService = inject(ProductsSortAndFilterService);
  eventManagement = inject(EventManagementService);
  actionHandler = inject(ActionHandlerService);

  // Inputs
  searchText = input.required<string>();

  // Outputs
  onEmpty = output<void>();
  searched = output<boolean>();

  // Variables
  searching = signal<boolean>(true);
  initialized = signal(false);
  allProducts = signal<ProductInterface[] | undefined>(undefined);
  hasNextPage = signal(false);
  queryId = signal<string>('');
  pageSize = 12;
  page = 0;
  sort = computed(() => {
    return this.sortAndFilterService.data().sort;
  });
  filters = computed(() => {
    return this.sortAndFilterService.data().filters;
  });
  isPriceFilterModified = computed(() => {
    return this.sortAndFilterService.isPriceFilterModified();
  });
  subscriptions: Subscription[] = [];
  combinedInputs = computed(() => {
    return {
      searchText: this.searchText(),
      filter: this.filters(),
      sort: this.sort(),
    };
  });

  constructor() {
    effect(() => {
      if (!this.allProducts()?.length && !this.searching() && this.page === 0) {
        this.onEmpty.emit();
      }
    });
    this.subscriptions.push(
      toObservable(this.combinedInputs).subscribe({
        next: () => {
          this.inputChanged();
        },
      }),
    );
    effect(
      () => {
        if (this.allProducts()?.length && this.page === 0) {
          this.searchHistoryService.pushToSearchHistory(this.searchText());
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.sortAndFilterService.resetSortAndFilter();
  }

  getProducts() {
    if (this.searchText() && this.searchText().length > 1) {
      this.searching.set(true);
      this.searched.emit(false);
      const productsPayload: ProductListPayloadInterface = {
        keyword: this.searchText(),
        available: true,
        restrictions: this.filters() as Restriction<string>[],
        orders: this.sort()?.title === ProductSortOptionsTitles.MOST_RELEVANT ? [] : ([this.sort()] as Order[]),
        size: this.pageSize,
        page: this.page,
      };
      const sub = this.productApi.getAllProducts(productsPayload).subscribe({
        next: (res) => {
          if (res.products.length > 0) {
            this.hasNextPage.set(res.products.length >= this.pageSize);
            this.queryId.set(res.queryId);
            this.allProducts.update((v) => [...(v ?? []), ...res.products]);
            if (this.allProducts()?.length && this.page === 0) {
              this.searchHistoryService.pushToSearchHistory(this.searchText());
            }
          } else {
            this.onEmpty.emit();
          }
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.searched.emit(true);
          this.searching.set(false);
          this.initialized.set(true);
        },
      });
      this.subscriptions.push(sub);
    }
  }

  handleNewPage(): void {
    if (this.hasNextPage() && this.initialized()) {
      this.page++;
      this.getProducts();
    }
  }

  inputChanged(): void {
    this.page = 0;
    if (!this.hasNextPage()) this.hasNextPage.set(true);
    if (this.allProducts()?.length) this.allProducts.set([]);
    this.getProducts();
  }

  handleProductClick(product: ProductInterface): void {
    this.eventManagement.triggerEvent(
      {
        eventType: 'redirect',
        data: {
          host: getHostname(product.url),
          to: product.url,
        },
        meta: '',
        breadCrumbs: ['stores-search', 'product'],
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
          'dp-medium': 'search-page',
          'dp-type': 'product',
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
