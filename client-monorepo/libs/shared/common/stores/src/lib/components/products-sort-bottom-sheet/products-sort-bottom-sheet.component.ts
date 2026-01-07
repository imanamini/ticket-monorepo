import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSortOptionInterface } from '../../data-access/models/product-sort-option.interface';
import { ProductSortOptionsConst } from '../../data-access/constants/product-sort-options.const';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ProductsSortAndFilterService } from '../../data-access/services/products-sort-and-filter.service';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-stores-products-sort-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxRadioButtonComponent, NgxButtonComponent],
  templateUrl: './products-sort-bottom-sheet.component.html',
  styleUrl: './products-sort-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsSortBottomSheetComponent {
  sortItems = signal<Array<ProductSortOptionInterface>>(ProductSortOptionsConst);
  bottomSheetService = inject(NgxBottomSheetService);
  sortAndFilterService = inject(ProductsSortAndFilterService);
  activeItem = signal<ProductSortOptionInterface>({} as ProductSortOptionInterface);
  itemsMap = computed(() => {
    return this.sortItems().map((item) => signal(item.title === this.activeItem().title));
  });

  constructor() {
    effect(
      () => {
        if (this.bottomSheetService.data() && this.bottomSheetService.data().activeSortItem) {
          this.activeItem.set(this.bottomSheetService.data().activeSortItem);
        }
      },
      { allowSignalWrites: true },
    );
  }

  handleItemSelect(item: ProductSortOptionInterface): void {
    this.activeItem.set(item);
  }
  submit(): void {
    this.sortAndFilterService.data.update((data) => {
      return {
        ...data,
        sort: this.activeItem(),
      };
    });
    this.bottomSheetService.closeBottomSheet();
  }

  cancel(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
