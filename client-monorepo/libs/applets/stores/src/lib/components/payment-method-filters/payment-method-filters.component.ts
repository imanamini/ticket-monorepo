import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRestrictionFields, StoresSingleFilterModel } from '@client-monorepo/stores';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import { Subscription } from 'rxjs';
import { StorePaymentMethod } from '@client-monorepo/stores';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { AccordionStateService, AccordionWithIsOpen } from '@digipay/ngx-accordion';

@Component({
  selector: 'stores-applet-payment-method-filters',
  standalone: true,
  imports: [CommonModule, NgxChipComponent, NgxCheckboxComponent],
  templateUrl: './payment-method-filters.component.html',
  styleUrl: './payment-method-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodFiltersComponent implements AccordionWithIsOpen, OnInit, OnDestroy {
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
    this.filters.set(
      this.filtersService.convertMapperToFilterItems({
        [StorePaymentMethod.BNPL]: 'خرید اعتباری',
        [StorePaymentMethod.C_CREDIT]: 'خرید با وام',
      }),
    );
    this.subscribeOnClearState();
  }

  getState(): void {
    const state = this.accordionStateService.getState(this.componentId());
    if (state) {
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
    this.filtersService.chipsTrailingIconFilterRemover(StoreRestrictionFields.PAYMENT_METHODS, selected.id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
