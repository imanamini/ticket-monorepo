import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { ProductFilterOptionInterface } from '../../data-access/models/product-filter-option.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ProductsSortBottomSheetComponent } from '../products-sort-bottom-sheet/products-sort-bottom-sheet.component';
import { ProductsSortAndFilterService } from '../../data-access/services/products-sort-and-filter.service';
import { ProductsPriceFilterBottomSheetComponent } from '../products-price-filter-bottom-sheet/products-price-filter-bottom-sheet.component';
import { NgxChipComponent } from '@digipay/ngx-chip';

@Component({
  selector: 'common-stores-products-sort-and-filter',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, NgxChipComponent],
  templateUrl: './products-sort-and-filter.component.html',
  styleUrl: './products-sort-and-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSortAndFilterComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  sortAndFilterService = inject(ProductsSortAndFilterService);
  sort = computed(() => {
    return this.sortAndFilterService.data().sort;
  });
  filters = computed(() => {
    return this.sortAndFilterService.data().filters;
  });
  priceFilter = computed<ProductFilterOptionInterface | undefined>(() => {
    return this.sortAndFilterService.priceFilter();
  });
  isPriceFilterModified = computed<boolean>(() => {
    return this.sortAndFilterService.isPriceFilterModified();
  });

  handleClickOnSort(): void {
    this.bottomSheetService.openBottomSheet(ProductsSortBottomSheetComponent, {
      activeSortItem: this.sort(),
    });
  }

  handleClickOnPriceRange(): void {
    this.bottomSheetService.openBottomSheet(ProductsPriceFilterBottomSheetComponent, {});
  }
}
