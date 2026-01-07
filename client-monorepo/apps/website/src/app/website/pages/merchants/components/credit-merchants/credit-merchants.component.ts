import { Component, Input, OnInit } from '@angular/core';
import { SingleMerchant } from '../../../../../api/digipay/models/merchants/single-merchant.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrandFilter, FilterOptions, MultipleCheckboxOptionsTypes, SingleFilter, SortMerchants } from './filters/filters';
import { STORE_PROVIDERS } from '../../../../../api/digipay/models/merchants/store-providers';
import { STORE_TYPES } from '../../../../../api/digipay/models/merchants/store-types';
import { STORE_CATEGORIES } from '../../../../../api/digipay/models/merchants/store-categories';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UiMerchantsFilterDialogComponent } from './merchants-filter/ui-merchants-filter-dialog/ui-merchants-filter-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { NotFoundMerchantsComponent } from './not-found-merchants/not-found-merchants.component';
import { SingleMerchantCardComponent } from '../single-merchant-card/single-merchant-card.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { SearchableCheckboxFilterComponent } from './merchants-filter/searchable-checkbox-filter/searchable-checkbox-filter.component';
import { MultipleCheckboxFiltersComponent } from './merchants-filter/multiple-checkbox-filters/multiple-checkbox-filters.component';
import { FilterChipsBoxComponent } from './merchants-filter/filter-chips-box/filter-chips-box.component';
import { NgIf, NgOptimizedImage, NgFor } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-credit-merchants',
  templateUrl: './credit-merchants.component.html',
  styleUrls: ['./credit-merchants.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    FilterChipsBoxComponent,
    MultipleCheckboxFiltersComponent,
    SearchableCheckboxFilterComponent,
    UiIconDirective,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    NgOptimizedImage,
    UiFormFieldBuilderModule,
    NgFor,
    SingleMerchantCardComponent,
    NotFoundMerchantsComponent,
  ],
})
export class CreditMerchantsComponent implements OnInit {
  @Input()
  creditMerchants: SingleMerchant[];

  sortingForm: FormGroup;

  filteredMerchants: SingleMerchant[] = [];

  filterList: Array<any>;
  providerFilter: SingleFilter<MultipleCheckboxOptionsTypes> = {
    title: 'provider',
    filterOptions: STORE_PROVIDERS,
  };
  typeFilter: SingleFilter<MultipleCheckboxOptionsTypes> = {
    title: 'type',
    filterOptions: STORE_TYPES,
  };
  categoryFilter: SingleFilter<MultipleCheckboxOptionsTypes> = {
    title: 'category',
    filterOptions: STORE_CATEGORIES,
  };
  brandFilter: SingleFilter<Array<BrandFilter>> = {
    title: 'brand',
    filterOptions: [],
  };
  brandTitleMap: { [key: string]: string };
  sortOptions = [
    {
      title: 'محبوب ترین',
      value: 0,
    },
    // {
    //   title: 'جدیدترین',
    //   value: 1
    // },
    // {
    //   title: 'قدیمی‌ترین',
    //   value: 2
    // },
    {
      title: 'به ترتیب حروف',
      value: 3,
    },
  ];
  selectedSortOption: SortMerchants = SortMerchants.MOST_POPULAR;
  selectedFilters: FilterOptions;
  totalNumOfFilters: number;
  protected readonly SortMerchants = SortMerchants;
  protected readonly Object = Object;

  constructor(
    private fb: FormBuilder,
    private bottomSheetService: MatBottomSheet,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sortingForm = this.fb.group({
      sort: [SortMerchants.MOST_POPULAR],
    });

    this.sortingForm.valueChanges.subscribe((changes) => {
      this.selectedSortOption = changes.sort;
      this.filterAndSort(this.selectedFilters, changes.sort);
    });

    this.buildBrandFilterOptions();

    this.filterList = [this.providerFilter, this.typeFilter, this.categoryFilter, this.brandFilter];

    this.filterAndSort(null, SortMerchants.MOST_POPULAR);

    this.checkQueryFilters();
  }

  checkQueryFilters() {
    const params = this.route.snapshot.queryParams;
    const tmp = {};
    Object.keys(params).forEach((key) => {
      if (key === 'providers' || key === 'type' || key === 'category') {
        tmp[key] = [params[key]];
      }
    });
    this.filterChanged(tmp);
  }

  buildBrandFilterOptions() {
    const filterOptions = [];
    for (const merchant of this.creditMerchants) {
      filterOptions.push({
        title: merchant.title,
        brandId: merchant.brandId,
        imagePath: merchant.imageId,
      });
      this.brandTitleMap = {
        ...this.brandTitleMap,
        [merchant.brandId]: merchant.title,
      };
    }
    this.brandFilter.filterOptions = filterOptions;
  }

  filterChanged(filterChanges: { [key: string]: Array<string> }) {
    this.selectedFilters = { ...this.selectedFilters, ...filterChanges };
    this.selectedFilters = this.purifyFilterChanges(this.selectedFilters);
    this.totalNumOfFilters = this.calculateTotalNumOfFilters(this.selectedFilters);
    this.filterAndSort(this.selectedFilters, null);
  }

  deleteAllFilters() {
    this.selectedFilters = {};
    this.filterAndSort(null, null);
  }

  calculateTotalNumOfFilters(filters: FilterOptions): number {
    let totalFilterCounter = 0;
    for (const filter in filters) {
      totalFilterCounter += filters[filter].length;
    }
    return totalFilterCounter;
  }

  purifyFilterChanges(filterChanges: FilterOptions): FilterOptions {
    const tmp = { ...filterChanges };
    for (const key in tmp) {
      if (tmp[key].length === 0) {
        delete tmp[key];
      }
    }
    return tmp;
  }

  sortMerchants(merchantsList: SingleMerchant[], sortPriority: SortMerchants) {
    switch (sortPriority) {
      case SortMerchants.MOST_POPULAR:
        return [...this.creditMerchants].sort((a, b) => a.priority - b.priority);
      case SortMerchants.NEWEST:
        return [...this.creditMerchants].sort((a, b) => b.creationDate - a.creationDate);
      case SortMerchants.OLDEST:
        return [...this.creditMerchants].sort((a, b) => a.creationDate - b.creationDate);
      case SortMerchants.ALPHABETIC:
        return this.sortAlphabetically(this.creditMerchants);
      default:
    }
  }

  sortAlphabetically(merchants: SingleMerchant[]): SingleMerchant[] {
    const collator = new Intl.Collator('fa');
    return [...merchants].sort((a, b) => collator.compare(a.title, b.title));
  }

  filterMerchants(merchantsList: SingleMerchant[], parameters: FilterOptions) {
    if (!parameters) {
      return;
    }
    const filterFun = (merchant: SingleMerchant) => {
      let resolveProvidersFilter = true;
      let resolveTypeFilter = true;
      let resolveCategoryFilter = false;
      let resolveBrandFilter = false;

      if (parameters.providers) {
        for (let i = 0; i < parameters.providers.length; ++i) {
          resolveProvidersFilter = resolveProvidersFilter && merchant.providers.includes(+parameters.providers[i]);
        }
      }

      if (parameters.type) {
        for (let i = 0; i < parameters.type.length; ++i) {
          resolveTypeFilter = resolveTypeFilter && merchant.type.includes(+parameters.type[i]);
        }
      }

      if (parameters.category && parameters.category.length > 0) {
        for (let i = 0; i < parameters.category.length; ++i) {
          resolveCategoryFilter = resolveCategoryFilter || merchant.category.includes(+parameters.category[i]);
        }
      } else {
        resolveCategoryFilter = true;
      }

      if (parameters.brand && parameters.brand.length > 0) {
        for (let i = 0; i < parameters.brand.length; ++i) {
          resolveBrandFilter = resolveBrandFilter || merchant.brandId == parameters.brand[i];
        }
      } else {
        resolveBrandFilter = true;
      }

      return resolveProvidersFilter && resolveTypeFilter && resolveCategoryFilter && resolveBrandFilter;
    };
    return [...merchantsList.filter(filterFun)];
  }

  filterAndSort(filterOptions: FilterOptions, sortType: SortMerchants) {
    let tmp =
      sortType != null
        ? this.sortMerchants(this.creditMerchants, sortType)
        : this.sortMerchants(this.creditMerchants, this.selectedSortOption);

    if (filterOptions != null) {
      tmp = this.filterMerchants(tmp, filterOptions);
    } else if (this.selectedFilters) {
      tmp = this.filterMerchants(tmp, this.selectedFilters);
    }

    this.filteredMerchants = tmp;
  }

  openFiltersDialog() {
    this.bottomSheetService
      .open(UiMerchantsFilterDialogComponent, {
        data: {
          selectedFilters: { ...this.selectedFilters },
          providerFilter: this.providerFilter,
          typeFilter: this.typeFilter,
          categoryFilter: this.categoryFilter,
          brandFilter: this.brandFilter,
          brandTitleMap: this.brandTitleMap,
        },
      })
      .afterDismissed()
      .subscribe((result) => {
        if (result) {
          this.selectedFilters = result;
          this.filterChanged(this.selectedFilters);
        }
      });
  }
}
