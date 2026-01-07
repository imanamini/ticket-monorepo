import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { storeCategories, StoreCategory, StoreCategoryTitleMapper, StoreCategoryToIconMapper } from '@client-monorepo/stores';

@Component({
  selector: 'lib-store-categories-filter',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, NgxChipComponent],
  templateUrl: './store-categories-filter.component.html',
  styleUrl: './store-categories-filter.component.scss',
})
export class StoreCategoriesFilterComponent {
  selectedCategory = model<StoreCategory | undefined>(undefined);
  classes = input('');
  categories = storeCategories;
  StoreCategoryTitleMapper = StoreCategoryTitleMapper;
  StoreCategoryToIconMapper = StoreCategoryToIconMapper;

  changeCategory(category: StoreCategory | undefined = undefined): void {
    this.selectedCategory.set(category);
  }
}
