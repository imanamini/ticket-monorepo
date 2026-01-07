import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import {
  StoreCategory,
  StoreCategoryTitleMapper,
  StoreRestrictionFields,
  StoresApiService,
  StoresSingleFilterModel,
} from '@client-monorepo/stores';
import { StoresCategoryComponent } from '../store-category/stores-category.component';
import { Subscription } from 'rxjs';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  selector: 'stores-applet-category-filters',
  standalone: true,
  imports: [CommonModule, StoresCategoryComponent, NgxChipComponent],
  templateUrl: './category-filters.component.html',
  styleUrl: './category-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFiltersComponent implements AccordionWithIsOpen, OnInit, OnDestroy {
  readonly String = String;

  // Injections
  filtersService = inject(StoreFiltersService);
  accordionStateService = inject(AccordionStateService);
  storesApi = inject(StoresApiService);

  // Inputs
  isOpen = input<boolean>(false);
  componentId = input<string>('');

  // Variables
  subscription?: Subscription;
  categories = signal<StoreCategory[]>([]);
  filters = signal<StoresSingleFilterModel[]>([]);
  selectedFilter = signal<StoresSingleFilterModel>({} as StoresSingleFilterModel);
  queryParams: { [key: string]: string } = {};

  constructor() {
    effect(
      () => {
        this.getState();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.generateCategories();
    this.subscribeOnClearState();
  }

  getState(): void {
    const state = this.accordionStateService.getState(this.componentId());
    if (state) {
      if (Array.isArray(state)) {
        this.selectedFilter.set(state[0] as StoresSingleFilterModel);
      } else {
        this.selectedFilter.set(state as StoresSingleFilterModel);
      }
    }
  }

  generateCategories(): void {
    this.filters.set(this.filtersService.convertMapperToFilterItems(StoreCategoryTitleMapper));
    this.storesApi.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
    });
  }

  handleCheckChanged(event: { isChecked: boolean; id: string }): void {
    const selectedCategory = this.categories().find((cat) => String(cat.id) === event.id);
    if (selectedCategory) {
      const selectedFilter = this.filters().find((filter) => filter.id === selectedCategory.title);
      if (selectedFilter) {
        if (event.isChecked) {
          this.selectedFilter.set(selectedFilter);
        }
      }
    }
    this.saveState();
  }

  saveState(): void {
    this.accordionStateService.saveState(this.componentId(), this.selectedFilter());
  }

  isSelected(title: string): boolean {
    return this.selectedFilter().id === title;
  }

  subscribeOnClearState(): void {
    this.subscription = this.accordionStateService.clearStateHappened.subscribe({
      next: (ids) => {
        if (ids.indexOf(this.componentId()) !== -1) {
          this.selectedFilter.set({} as StoresSingleFilterModel);
        }
      },
    });
  }

  handleTrailingIconClicked(selected: StoresSingleFilterModel) {
    this.filtersService.chipsTrailingIconFilterRemover(StoreRestrictionFields.CATEGORIES, selected.id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
