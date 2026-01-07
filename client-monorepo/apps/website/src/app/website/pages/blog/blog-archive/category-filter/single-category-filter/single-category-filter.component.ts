import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CategoryFilter } from '../../../../../../api/digipay/models/blog/archive-filters.model';
import { NgClass, NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-single-category-filter',
  templateUrl: './single-category-filter.component.html',
  styleUrls: ['./single-category-filter.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, UiIconDirective, NgOptimizedImage, NgFor, NgxIcon],
})
export class SingleCategoryFilterComponent implements OnChanges {
  @Input()
  isOpen = false;

  @Input()
  categoryData: CategoryFilter;

  @Input()
  selectedCategoryId: string;

  @Output()
  selectCategoryId = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCategoryId) {
      this.updateOpenness();
    }
  }

  selectCategory(categoryId: string) {
    this.selectCategoryId.emit(categoryId);
  }

  headerClicked() {
    if (!this.isOpen && this.categoryData.children.length > 0) {
      this.isOpen = true;
    }
    this.selectCategoryId.emit(this.categoryData.id);
  }

  containsCategoryWithId(categoryId: string): boolean {
    return this.categoryData.children.find((child) => child.id === categoryId) !== undefined;
  }

  hasChildren(): boolean {
    return this.categoryData.children.length > 0;
  }

  updateOpenness() {
    if (this.hasChildren()) {
      this.isOpen = this.categoryData.id === this.selectedCategoryId || this.containsCategoryWithId(this.selectedCategoryId);
    }
  }
}
