import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ArchiveFilters, CategoryFilter } from '../../../../../api/digipay/models/blog/archive-filters.model';
import { NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { SingleCategoryFilterComponent } from './single-category-filter/single-category-filter.component';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  standalone: true,
  imports: [NgIf, UiIconDirective, NgFor, SingleCategoryFilterComponent],
})
export class CategoryFilterComponent implements OnChanges {
  @Input()
  filters: ArchiveFilters;

  @Input()
  selectedCategoryId: string;

  @Output()
  selectCategoryId = new EventEmitter<string>();

  openedSingleCategory: CategoryFilter;

  findOpenedCategory(categories: CategoryFilter[], categoryId: string): CategoryFilter {
    for (let i = 0; i < categories.length; ++i) {
      if (categories[i].id === categoryId) {
        return categories[i];
      } else if (categories[i].children && categories[i].children.length > 0) {
        const categoryFilter = this.findOpenedCategory(categories[i].children, categoryId);
        if (categoryFilter) {
          return categoryFilter;
        }
      }
    }
  }

  categoryClicked(categoryId: string) {
    this.selectCategoryId.emit(categoryId);
  }

  clearCategoryFilter() {
    this.selectedCategoryId = null;
    this.openedSingleCategory = null;
    this.selectCategoryId.emit('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCategoryId) {
      this.openedSingleCategory = this.findOpenedCategory(this.filters.categories, this.selectedCategoryId);
    }
  }
}
