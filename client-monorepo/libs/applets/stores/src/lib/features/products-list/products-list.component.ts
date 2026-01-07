import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { ProductInterface, ProductPreviewComponent, ProductsSortAndFilterComponent } from '@client-monorepo/stores';
import { NoItemComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { ProductsListService } from '../../data-access/services/products-list-service';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'stores-applet-products-list',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ProductPreviewComponent,
    ScrolledToEndDirective,
    NoItemComponent,
    ProductsSortAndFilterComponent,
    NgxSearchBoxComponent,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit, OnDestroy {
  config = computed(() => this.productListService.config());
  products = computed(() => this.productListService.products());
  productsLoading = computed(() => this.productListService.productsLoading());
  hasInstallment = signal(false);

  oneStoreInDiscountMode = false;
  singleStore = computed(() => this.config()?.mode === 'products' || (this.config()?.mode === 'discount' && this.oneStoreInDiscountMode));

  rangeCreator = rangeCreator;

  productListService = inject(ProductsListService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  bottomNavigationService = inject(NgxBottomNavigationService);

  constructor() {
    toObservable(this.productListService.sort)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.productListService.initialized()) {
            this.productListService.reloadProducts();
          }
        },
      });
    toObservable(this.productListService.filters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.productListService.initialized()) {
            this.productListService.reloadProducts();
          }
        },
      });
  }

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.getQueryParam();
    this.productListService.resetSortAndFilter();
    this.productListService.initializePageConfig();
  }

  getQueryParam(): void {
    const promotionId = this.activatedRoute.snapshot.paramMap.get('promotionId') || '';
    const storeTitle = this.activatedRoute.snapshot.paramMap.get('title') || '';
    const minDiscount = this.activatedRoute.snapshot.paramMap.get('minDiscount') || '';
    const hasInstallment = this.activatedRoute.snapshot.queryParamMap.get('4pay') || '';
    if (hasInstallment) this.hasInstallment.set(true);
    if (promotionId) {
      this.productListService.promotionId.set(promotionId);
    } else if (storeTitle) {
      this.productListService.storeTitle = decodeURI(storeTitle) as string;
    } else if (minDiscount) {
      const maxDiscount = this.activatedRoute.snapshot.paramMap.get('maxDiscount') || '';
      const title = this.activatedRoute.snapshot.paramMap.get('pageTitle') || '';
      const categories = this.activatedRoute.snapshot.queryParamMap.get('categories') || '';
      const storeIds = this.activatedRoute.snapshot.queryParamMap.get('storeIds') || '';
      this.oneStoreInDiscountMode = storeIds.split('_').length === 1;

      this.productListService.discountConfig.set({
        title: title.replaceAll('_', ' '),
        min: +minDiscount,
        max: +maxDiscount,
        aiCategory: categories,
        storeIds,
      });
    }
  }

  loadNewPage(): void {
    this.productListService.loadNewPage();
  }

  goToProductPage(product: ProductInterface) {
    this.productListService.goToProductPage(product);
  }

  searchEnd(event: any) {
    this.productListService.searchEnd(event);
  }

  ngOnDestroy(): void {
    this.productListService.resetAllStates();
    this.bottomNavigationService.show();
  }
}
