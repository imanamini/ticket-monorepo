import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFiltersComponent } from '../category-filters/category-filters.component';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import { SortFiltersComponent } from '../sort-filters/sort-filters.component';
import { PaymentMethodFiltersComponent } from '../payment-method-filters/payment-method-filters.component';
import { StoreTypeFiltersComponent } from '../store-type-filters/store-type-filters.component';
import {
  StoreCategoryTitleMapper,
  StorePaymentMethodMapper,
  StoreRestrictionFields,
  StoreRestrictionToFilterComponentIdMapper,
  StoreSortMapper,
  StoreTypeMapper,
} from '@client-monorepo/stores';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AccordionConfig, AccordionStateService, NgxAccordionComponent } from '@digipay/ngx-accordion';

@Component({
  selector: 'stores-applet-stores-list-filters',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAccordionComponent],
  templateUrl: './stores-list-filters.component.html',
  styleUrl: './stores-list-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresListFiltersComponent implements OnInit, OnDestroy {
  // Injects
  filtersService = inject(StoreFiltersService);
  accordionStateService = inject(AccordionStateService);
  bottomSheetService = inject(NgxBottomSheetService);

  // Variables
  accordionConfigs = signal<
    AccordionConfig<CategoryFiltersComponent | SortFiltersComponent | PaymentMethodFiltersComponent | StoreTypeFiltersComponent>[]
  >([
    {
      component: SortFiltersComponent,
      inputs: { componentId: StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.SORT] },
      accordionTitle: 'مرتب‌سازی',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: '',
    },
    {
      component: CategoryFiltersComponent,
      inputs: { componentId: StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.CATEGORIES] },
      accordionTitle: 'دسته‌بندی',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: '',
    },
    {
      component: PaymentMethodFiltersComponent,
      inputs: { componentId: StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.PAYMENT_METHODS] },
      accordionTitle: 'نحوه خرید',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: '',
    },
    {
      component: StoreTypeFiltersComponent,
      inputs: { componentId: StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.STORE_TYPE] },
      accordionTitle: 'نوع فروشگاه',
      showDivider: true,
      isOpen: false,
      leadingTitleIcon: '',
    },
  ]);

  ngOnInit(): void {
    this.initValues();
    this.readFiltersFromRoute();
  }

  private initValues(): void {}
  readFiltersFromRoute(): void {
    const keys = Object.keys(StoreRestrictionToFilterComponentIdMapper) as StoreRestrictionFields[];
    const result = this.filtersService.extractFiltersFromRouteByKeys(keys);
    if (result.length > 0) {
      result.forEach((item) => {
        let mapper: Record<string, any> = {};
        if (item.key === keys[0]) {
          // sort
          mapper = StoreSortMapper;
        } else if (item.key === keys[1]) {
          // Category
          mapper = StoreCategoryTitleMapper;
        } else if (item.key === keys[2]) {
          // PaymentMethod
          mapper = StorePaymentMethodMapper;
        } else if (item.key === keys[3]) {
          // StoreType
          mapper = StoreTypeMapper;
        }
        const mapperKeys = item.value.split(',');
        this.accordionStateService.saveState(
          StoreRestrictionToFilterComponentIdMapper[item.key],
          this.filtersService.extractFiltersFromMapperByKeys(mapper, mapperKeys),
        );
      });
    }
  }

  submitFilters(): void {
    const entriesArray = Object.entries(StoreRestrictionToFilterComponentIdMapper);
    const params: { [key: string]: string } = {};
    entriesArray.forEach(([key, value]) => {
      const state: any = this.accordionStateService.getState(value);
      if (Array.isArray(state)) {
        const values: string[] = state.map((item) => item.id);
        params[key] = values.join(',');
      } else if (state !== undefined) {
        params[key] = state.id;
      }
    });
    this.filtersService.addFiltersToRoute(params);
    this.bottomSheetService.outputData.set({ res: 'ok' });
    this.bottomSheetService.closeBottomSheet();
  }

  dismissFilters(): void {
    this.bottomSheetService.outputData.set({ res: 'dismiss' });
    this.bottomSheetService.closeBottomSheet();
  }

  deleteAllFilters(): void {
    this.accordionStateService.bulkClearState([
      StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.STORE_TYPE],
      StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.SORT],
      StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.PAYMENT_METHODS],
      StoreRestrictionToFilterComponentIdMapper[StoreRestrictionFields.CATEGORIES],
    ]);
  }

  ngOnDestroy(): void {
    this.deleteAllFilters();
  }
}
