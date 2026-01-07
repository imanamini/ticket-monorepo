import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductSortOptionInterface, ProductSortOptionsTitles } from '../models/product-sort-option.interface';
import { ProductFilterOptionInterface, ProductFilterOptionTitles } from '../models/product-filter-option.interface';
import { ProductSortOptionsConst } from '../constants/product-sort-options.const';
import { ProductFilterOptionsConst } from '../constants/product-filter-options.const';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductsSortAndFilterService {
  public data = signal<{
    sort?: ProductSortOptionInterface;
    filters?: Array<ProductFilterOptionInterface>;
  }>({});

  priceFacet = signal<{ min: number; max: number } | undefined>(undefined);

  priceFilter = computed<ProductFilterOptionInterface | undefined>(() => {
    let priceFilter = this.data().filters?.find((filterItem) => filterItem.title === ProductFilterOptionTitles.PRICE);
    if (!this.priceFacet()) return undefined;
    if (priceFilter) {
      priceFilter = JSON.parse(JSON.stringify(priceFilter));
    }
    if (priceFilter && this.priceFacet()) {
      priceFilter.rangeMin = this.priceFacet()?.min;
      priceFilter.rangeMax = this.priceFacet()?.max;
      if ((priceFilter.minValue ?? 0) < (this.priceFacet()?.min || 0)) {
        priceFilter.minValue = this.priceFacet()?.min || 0;
      }
      if ((priceFilter.maxValue ?? 0) > (this.priceFacet()?.max || 0)) {
        priceFilter.maxValue = this.priceFacet()?.max || 0;
      }
    }
    return priceFilter;
  });

  isPriceFilterModified = computed<boolean>(() => {
    return (
      !!this.priceFilter() &&
      (this.priceFilter()?.minValue != this.priceFilter()?.rangeMin || this.priceFilter()?.maxValue != this.priceFilter()?.rangeMax)
    );
  });

  activatedRoute = inject(ActivatedRoute);

  setPriceFacet(min: number, max: number) {
    this.priceFacet.set({
      min: min && min > 1000 ? min : 1000,
      max,
    });
  }

  resetSortAndFilter(): void {
    let defaultTitleCondition = ProductSortOptionsTitles.MOST_RELEVANT;
    const sortQueryParam = this.activatedRoute.snapshot.queryParamMap.get('sort') as keyof typeof ProductSortOptionsTitles;
    if (sortQueryParam && ProductSortOptionsTitles[sortQueryParam]) {
      defaultTitleCondition = ProductSortOptionsTitles[sortQueryParam];
    }
    const defaultSortOption = ProductSortOptionsConst.find((option) => option.title === defaultTitleCondition) || undefined;
    this.data.set({
      sort: defaultSortOption,
      filters: ProductFilterOptionsConst,
    });
    this.priceFacet.set(undefined);
  }
}
