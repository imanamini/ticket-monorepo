import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import { StoreRestrictionFields, StoresSingleFilterModel, StoreType, StoreTypeMapper } from '@client-monorepo/stores';
import { Subscription } from 'rxjs';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  selector: 'stores-applet-store-type-filters',
  standalone: true,
  imports: [CommonModule, NgxChipComponent, NgxCheckboxComponent],
  templateUrl: './store-type-filters.component.html',
  styleUrl: './store-type-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTypeFiltersComponent implements AccordionWithIsOpen, OnInit, OnDestroy {
  // Injections
  accordionStateService = inject(AccordionStateService);
  filtersService = inject(StoreFiltersService);

  // Inputs
  isOpen = input<boolean>(false);

  // Variables
  componentId = input<string>('');
  filters = signal<StoresSingleFilterModel[]>([]);
  selectedFilters = signal<StoresSingleFilterModel[]>([]);
  subscription?: Subscription;

  constructor() {
    effect(
      () => {
        this.getState();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    const mapper = StoreTypeMapper;
    delete mapper[StoreType.SOCIAL_INSTAGRAM]; // Social Must not be here
    this.filters.set(this.filtersService.convertMapperToFilterItems(mapper));
    this.subscribeOnClearState();
  }

  getState(): void {
    if (this.accordionStateService.getState(this.componentId())) {
      this.selectedFilters.set(this.accordionStateService.getState(this.componentId()) as StoresSingleFilterModel[]);
    }
  }

  handleCheckChange(id: string, isChecked: boolean): void {
    const selectedOne = this.filters().find((filter) => String(filter.id) === id);
    if (selectedOne) {
      if (isChecked) {
        this.selectedFilters.update((v) => [...v, selectedOne]);
      } else {
        this.selectedFilters.update((v) => v.filter((filter) => filter.id !== selectedOne.id));
      }
    }
    this.saveState();
  }

  saveState(): void {
    this.accordionStateService.saveState(this.componentId(), this.selectedFilters());
  }

  isSelected(id: string): boolean {
    return this.selectedFilters().some((filter) => filter.id === id);
  }

  subscribeOnClearState(): void {
    this.subscription = this.accordionStateService.clearStateHappened.subscribe({
      next: (ids) => {
        if (ids.indexOf(this.componentId()) !== -1) {
          this.selectedFilters.set([]);
        }
      },
    });
  }

  handleTrailingIconClicked(selected: StoresSingleFilterModel) {
    this.filtersService.chipsTrailingIconFilterRemover(StoreRestrictionFields.STORE_TYPE, selected.id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
