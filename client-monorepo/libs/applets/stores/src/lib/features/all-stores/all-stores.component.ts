import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterComponent,
  ItemOverview,
  ItemOverviewComponent,
  NoItemComponent,
  PageLayoutComponent,
  SearchComponent,
} from '@client-monorepo/common/ui-components';
import { StoresListFiltersComponent } from '../../components/stores-list-filters/stores-list-filters.component';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import {
  Store,
  StoreCategoryTitle,
  StoreCategoryTitleMapper,
  StorePaymentMethod,
  StorePaymentMethodMapper,
  StoreRestrictionFields,
  StoreRestrictionToFilterComponentIdMapper,
  StoresApiService,
  StoreSort,
  StoreSortMapper,
  StoresService,
  StoreType,
  StoreTypeMapper,
} from '@client-monorepo/stores';
import { RestrictionTypes } from '@client-monorepo/common/network';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterChipsModel } from '../../data-access/models/filter-chips.model';
import { rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { LocationService } from '@client-monorepo/common/location-management';
import { DistancePipe } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'stores-applet-all-stores',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    FilterComponent,
    ItemOverviewComponent,
    SearchComponent,
    NgxSkeletonLoadingComponent,
    ScrolledToEndDirective,
    NoItemComponent,
    NgxChipComponent,
    NgxBadgeModule,
  ],
  providers: [DistancePipe],
  templateUrl: './all-stores.component.html',
  styleUrl: './all-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllStoresComponent implements OnInit, OnDestroy {
  // Injections
  bottomSheetService = inject(NgxBottomSheetService);
  filtersService = inject(StoreFiltersService);
  storesApi = inject(StoresApiService);
  storesService = inject(StoresService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  backHandler = inject(BackHandlerService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  locationService = inject(LocationService);
  distancePipe = inject(DistancePipe);

  // Variables
  protected readonly rangeCreator = rangeCreator;
  baseFilterItems: FilterChipsModel[] = [];
  baseFilterItemsToShow = signal<FilterChipsModel[]>([]);
  activeFilterItems = signal<FilterChipsModel[]>([]);
  storesList = signal<Store[]>([]);
  storesToShow = signal<ItemOverview[] | undefined>(undefined);
  storesLoading = signal<boolean>(false);
  totalStoreItems = signal<number | undefined>(undefined);
  subscriptions = new Subscription();
  queryParams: { [key: string]: string } = {};
  chipsTypeToIconMapper = {
    NONE: '',
    EXPANDABLE: 'arrow-2-down',
    DELETABLE: 'close',
    QUICK_FILTER: '',
  };
  scrollSub!: Subscription;
  pageSize = 10;
  haveNextPage = true;
  currentPage = 0;
  initialized = signal<boolean>(false);
  searchPhrase = signal<string>('');

  ngOnInit(): void {
    this.initializePage();
  }

  initializePage(): void {
    this.bottomNavigationService.hide();
    this.initiateBaseFilters();
    this.locationService.getGuaranteedLocation(false, this.storesService.ttlForOptionalLocation, 2000).subscribe(() => {
      this.subscribeOnRouteParams();
    });
  }

  initiateBaseFilters(): void {
    const onSite = StoreTypeMapper[StoreType.ONSITE];
    const online = StoreTypeMapper[StoreType.ONLINE];
    const cCredit = StorePaymentMethodMapper[StorePaymentMethod.C_CREDIT];
    const bnpl = StorePaymentMethodMapper[StorePaymentMethod.BNPL];
    const baseFilters: FilterChipsModel[] = [
      {
        order: 0,
        value: '',
        label: 'مرتب سازی',
        clickDisabled: true,
        routeKey: StoreRestrictionFields.SORT,
        pressed: false,
        type: 'EXPANDABLE',
      },
      {
        order: 2,
        value: StorePaymentMethod.BNPL,
        label: bnpl,
        routeKey: StoreRestrictionFields.PAYMENT_METHODS,
        clickDisabled: true,
        pressed: false,
        type: 'QUICK_FILTER',
      },
      {
        order: 1,
        value: StorePaymentMethod.C_CREDIT,
        routeKey: StoreRestrictionFields.PAYMENT_METHODS,
        label: cCredit,
        clickDisabled: true,
        pressed: false,
        type: 'QUICK_FILTER',
      },
      {
        order: 3,
        value: '',
        label: 'دسته بندی‌ها',
        routeKey: StoreRestrictionFields.CATEGORIES,
        clickDisabled: true,
        pressed: false,
        type: 'EXPANDABLE',
      },
      {
        order: 4,
        value: StoreType.ONSITE,
        label: onSite,
        routeKey: StoreRestrictionFields.STORE_TYPE,
        clickDisabled: true,
        pressed: false,
        type: 'QUICK_FILTER',
      },
      {
        order: 5,
        value: StoreType.ONLINE,
        routeKey: StoreRestrictionFields.STORE_TYPE,
        label: online,
        clickDisabled: true,
        pressed: false,
        type: 'QUICK_FILTER',
      },
    ];
    this.baseFilterItems = [...baseFilters];
    this.baseFilterItemsToShow.set([...baseFilters]);
  }

  subscribeOnRouteParams(): void {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe({
        next: (params) => {
          this.queryParams = params;
          if (!this.queryParams[StoreRestrictionFields.SORT]) {
            this.addDefaultSortFilter();
          } else {
            this.readFiltersFromRoute();
            this.currentPage = 0;
            this.makeApiCall();
          }
        },
      }),
    );
  }

  addDefaultSortFilter(): void {
    if (this.queryParams[StoreRestrictionFields.SORT]) {
      return;
    }
    const query: { [key: string]: string } = {
      ...(this.queryParams ?? {}),
      [StoreRestrictionFields.SORT]: StoreSort.PRIORITY,
    };
    this.filtersService.addFiltersToRoute(query);
  }

  readFiltersFromRoute(): void {
    const keys = Object.keys(this.queryParams) as StoreRestrictionFields[];
    const result = this.filtersService.extractFiltersFromRouteByKeys(keys);
    if (result.length > 0) {
      this.modifyTagChipsByResult(result);
    }
  }

  modifyTagChipsByResult(result: { key: StoreRestrictionFields; value: string }[]): void {
    const activeFilters: FilterChipsModel[] = [];
    let mockBaseFilters: FilterChipsModel[] = [...this.baseFilterItems];
    result.forEach((res) => {
      switch (res.key) {
        case StoreRestrictionFields.SORT:
        case StoreRestrictionFields.CATEGORIES:
          activeFilters.push({
            order: res.key === StoreRestrictionFields.SORT ? 0 : 3,
            label:
              res.key === StoreRestrictionFields.SORT
                ? StoreSortMapper[res.value as StoreSort]
                : StoreCategoryTitleMapper[res.value as StoreCategoryTitle],
            clickDisabled: true,
            routeKey: res.key,
            value: res.value,
            pressed: true,
            type: res.key === StoreRestrictionFields.SORT ? 'EXPANDABLE' : 'DELETABLE',
          });
          mockBaseFilters = mockBaseFilters.filter((item) => !(item.routeKey === res.key));
          break;
        case StoreRestrictionFields.STORE_TYPE:
        case StoreRestrictionFields.PAYMENT_METHODS:
          res.value.split(',').forEach((val) => {
            const order = mockBaseFilters.find((baseFilter) => String(baseFilter.value) === String(val))?.order;
            activeFilters.push({
              order: order ?? 0,
              label:
                res.key === StoreRestrictionFields.STORE_TYPE
                  ? StoreTypeMapper[Number(val) as StoreType]
                  : StorePaymentMethodMapper[Number(val) as StorePaymentMethod],
              clickDisabled: true,
              value: val,
              routeKey: res.key,
              pressed: true,
              type: 'DELETABLE',
            });
          });
          mockBaseFilters = mockBaseFilters.filter(
            (item) => !(item.routeKey === res.key && res.value.split(',').includes(String(item.value))),
          );
          break;
      }
    });
    activeFilters.sort((a, b) => a.order - b.order);
    mockBaseFilters.sort((a, b) => a.order - b.order);
    this.activeFilterItems.set(activeFilters);
    this.baseFilterItemsToShow.set(mockBaseFilters);
  }

  handleFilterToggle(): void {
    this.bottomSheetService.openBottomSheet(StoresListFiltersComponent, null, { noPadding: true });
    this.subscriptions.add(
      this.bottomSheetService.onClose.subscribe(() => {
        this.readFiltersFromRoute();
        this.makeApiCall();
      }),
    );
  }

  doSearch(phrase: string): void {
    const trimmed = phrase.trim();
    if (trimmed === '' || trimmed!.length > 1) {
      this.searchPhrase.set(trimmed);
      this.storesToShow.set([]);
      this.makeApiCall();
    }
  }

  makeApiCall(): void {
    if (this.storesLoading()) return;
    this.storesLoading.set(true);
    const requestBody = this.filtersService.createFilterRequestBody(
      StoreRestrictionToFilterComponentIdMapper,
      RestrictionTypes.COLLECTION,
      'eq',
    );
    if (this.searchPhrase() !== '' && this.searchPhrase()!.length > 1) {
      requestBody.restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: StoreRestrictionFields.KEYWORD,
        value: this.searchPhrase()!,
        operation: 'eq',
      });
    }
    this.storesApi.searchStores(requestBody, this.currentPage, this.pageSize, true).subscribe({
      next: (result) => {
        this.storesList.set([...result.stores]);
        this.totalStoreItems.set(result.totalElements);
        this.haveNextPage = result.stores.length >= this.pageSize;
        this.generateStoresToShow(this.currentPage === 0);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.storesLoading.set(false);
        this.initialized.set(true);
      },
    });
  }

  generateStoresToShow(reset = false): void {
    if (reset) {
      this.storesToShow.set([]);
    }

    let newStores: ItemOverview[] = this.storesToShow()?.length ? [...this.storesToShow()!] : [];
    if (newStores.length > 0) {
      newStores[newStores.length - 1] = { ...newStores[newStores.length - 1], divider: true };
    }
    const existingIds = new Set(newStores.map((item) => item.id));
    newStores = [...newStores, ...this.storesService.convertStoreToItemOverView(this.storesList(), this.distancePipe, true, existingIds)];
    this.storesToShow.set(newStores);
  }

  handleBaseFilterClick(filter: FilterChipsModel): void {
    if (filter.type === 'QUICK_FILTER') {
      let query: { [key: string]: string } = this.queryParams;
      query = { ...query, [filter.routeKey]: filter.value };
      this.filtersService.addFiltersToRoute(query);
    } else if (filter.type === 'EXPANDABLE') {
      this.handleFilterToggle();
    }
  }

  activeFilterTrailingIconClick(filter: FilterChipsModel): void {
    if (filter.type === 'EXPANDABLE') {
      this.handleFilterToggle();
    } else if (filter.type === 'DELETABLE') {
      this.deleteChipsFilter(filter);
    }
  }

  deleteChipsFilter(filter: FilterChipsModel): void {
    this.filtersService.chipsTrailingIconFilterRemover(filter.routeKey, filter.value);
  }

  deleteAllFilters(): void {
    if (this.activeFilterItems().length) {
      this.filtersService.addFiltersToRoute({});
    }
  }

  listEnded(): void {
    if (this.haveNextPage && this.initialized()) {
      this.currentPage++;
      this.makeApiCall();
    }
  }

  goToStoreShop(store: ItemOverview): void {
    this.router.navigate(['/stores/', store.id]).then();
  }

  openGuideBottomSheet(): void {
    this.router.navigate(['/stores', 'shopping-guide']).then();
  }

  ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
    this.bottomNavigationService.show();
  }
}
