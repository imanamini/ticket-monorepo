import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreSort, StoreSortMapper, StoresSingleFilterModel } from '@client-monorepo/stores';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import { Subscription } from 'rxjs';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  selector: 'stores-applet-sort-filters',
  standalone: true,
  imports: [CommonModule, NgxRadioButtonComponent, NgxChipComponent],
  templateUrl: './sort-filters.component.html',
  styleUrl: './sort-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortFiltersComponent implements AccordionWithIsOpen, OnInit, OnDestroy {
  // Injections
  filtersService = inject(StoreFiltersService);
  accordionStateService = inject(AccordionStateService);

  // Inputs
  isOpen = input<boolean>(false);
  componentId = input<string>('');

  // Variables
  subscription?: Subscription;
  filters = signal<StoresSingleFilterModel[]>([]);
  selectedFilter = signal<StoresSingleFilterModel>({} as StoresSingleFilterModel);

  constructor() {
    effect(
      () => {
        this.getState();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.filters.set(this.filtersService.convertMapperToFilterItems(StoreSortMapper));
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

  saveState(): void {
    this.accordionStateService.saveState(this.componentId(), this.selectedFilter());
  }

  handleCheckChange(id: string, isChecked: boolean): void {
    const filter = this.filters().find((filterItem) => filterItem.id === id);
    if (filter) {
      if (isChecked) {
        this.selectedFilter.set(filter);
      }
      this.saveState();
    }
  }

  subscribeOnClearState(): void {
    this.subscription = this.accordionStateService.clearStateHappened.subscribe({
      next: (ids) => {
        if (ids.indexOf(this.componentId()) !== -1) {
          const defaultSort: StoresSingleFilterModel =
            this.filters().find((filter) => filter.id === StoreSort.PRIORITY) ?? ({} as StoresSingleFilterModel);
          this.selectedFilter.set(defaultSort);
          this.saveState();
        }
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
