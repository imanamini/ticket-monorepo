import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  CategorizedServiceBuilderComponent,
  CategorizedServiceItemInterface,
  RecommendedBillTypeInterface,
} from '@client-monorepo/common/app-services';
import { FilterComponent, PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxChipComponent } from '@digipay/ngx-chip';
import {
  AppService,
  AppServiceCategoryNamesEnum,
  appServicesCategoriesConst,
  AppServiceStatusEnum,
  FrequentServiceInterface,
} from '@client-monorepo/common/service-data';
import { Router } from '@angular/router';
import { HubFilterModel } from '../../data-access/models/hub-filter.model';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillApiService, BillGeneralService } from '@client-monorepo/daily-fintech/bill';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { CallbackInstallmentsOverviewKey } from '@client-monorepo/applets/credit';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'hub-applet-hub-main-services',
  standalone: true,
  imports: [PageLayoutComponent, FilterComponent, NgxChipComponent, CategorizedServiceBuilderComponent, NgxSearchBoxComponent],
  templateUrl: './hub-main-services.component.html',
  styleUrl: './hub-main-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainServicesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filterComponent') filterComponent!: FilterComponent;

  // Injects
  appServiceService = inject(AppService);
  private router = inject(Router);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private destroyRef = inject(DestroyRef);
  private billApiService = inject(BillApiService);
  private actionHandlerService = inject(ActionHandlerService);
  private billService = inject(BillGeneralService);

  // Signals
  isLoading = signal<boolean>(true);
  allServices = signal<Array<FrequentServiceInterface>>([]);
  selectedFilter = signal<HubFilterModel | null>(null);
  searchText = signal<string>('');
  recommendedBills = signal<Array<RecommendedBillTypeInterface>>([]);
  billsLoading = signal<boolean>(true);
  private eventManagementService = inject(EventManagementService);
  filteredServices = computed(() => {
    const filter = this.selectedFilter();
    const value = filter?.value;

    if (!value) return this.allServices();

    return this.allServices().filter((service) => (service.categories ?? []).some((cat) => cat.name === value));
  });

  categoryList = signal([
    { category: AppServiceCategoryNamesEnum.PAY, iconColor: '#4657C3' },
    { category: AppServiceCategoryNamesEnum.MOBILE, iconColor: '#4657C3' },
    { category: AppServiceCategoryNamesEnum.BILL, iconColor: '#4657C3' },
    { category: AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES, iconColor: '#925DFD' },
    { category: AppServiceCategoryNamesEnum.WEALTH, iconColor: '#57D176' },
    { category: AppServiceCategoryNamesEnum.INSURANCE, iconColor: '#296ED6' },
    { category: AppServiceCategoryNamesEnum.VEHICLE, iconColor: '#4657C3' },
    { category: AppServiceCategoryNamesEnum.OTHER_SERVICES, iconColor: '#4657C3' },
  ]);
  filterCategoryItems = signal<HubFilterModel[]>([
    {
      order: 0,
      id: AppServiceCategoryNamesEnum.BNPL_SERVICES,
      value: AppServiceCategoryNamesEnum.BNPL_SERVICES,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.BNPL_SERVICES].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 1,
      id: AppServiceCategoryNamesEnum.PAY,
      value: AppServiceCategoryNamesEnum.PAY,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.PAY].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 2,
      id: AppServiceCategoryNamesEnum.INSURANCE,
      value: AppServiceCategoryNamesEnum.INSURANCE,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.INSURANCE].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#296ED6',
    },
    {
      order: 3,
      id: AppServiceCategoryNamesEnum.BILL,
      value: AppServiceCategoryNamesEnum.BILL,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.BILL].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 4,
      id: AppServiceCategoryNamesEnum.MOBILE,
      value: AppServiceCategoryNamesEnum.MOBILE,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.MOBILE].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 5,
      id: AppServiceCategoryNamesEnum.VEHICLE,
      value: AppServiceCategoryNamesEnum.VEHICLE,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.VEHICLE].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 6,
      id: AppServiceCategoryNamesEnum.WALLET,
      value: AppServiceCategoryNamesEnum.WALLET,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.WALLET].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
    {
      order: 7,
      id: AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES,
      value: AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.BNPL_CREDIT_SERVICES].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#925DFD',
    },
    {
      order: 8,
      id: AppServiceCategoryNamesEnum.WEALTH,
      value: AppServiceCategoryNamesEnum.WEALTH,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.WEALTH].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#57D176',
    },
    {
      order: 9,
      id: AppServiceCategoryNamesEnum.OTHER_SERVICES,
      value: AppServiceCategoryNamesEnum.OTHER_SERVICES,
      label: appServicesCategoriesConst[AppServiceCategoryNamesEnum.OTHER_SERVICES].description || '',
      clickDisabled: true,
      pressed: false,
      iconColor: '#4657C3',
    },
  ]);
  sortedFilterCategoryItems = computed<HubFilterModel[]>(() => {
    return this.filterCategoryItems().sort((item1, item2) => {
      if (this.selectedFilter() === null) {
        return 0;
      }
      if (item1.id === this.selectedFilter()?.id) {
        return -1;
      }
      if (item2.id === this.selectedFilter()?.id) {
        return 1;
      }
      return 0;
    });
  });
  ngOnInit() {
    this.bottomNavigationService.hide();
    this.getServices();
    this.getRecommendedBills();
  }

  ngAfterViewInit() {
    const params = this.router.parseUrl(this.router.url).queryParams;
    const filter = params['filter'] ?? '';
    if (filter) {
      this.filterCategoryItems().forEach((item) => {
        if (item.id === String(filter)) {
          this.selectedFilter.set(item);
          return;
        }
      });
    }
  }
  ngOnDestroy() {
    this.bottomNavigationService.show();
  }
  getRecommendedBills(): void {
    this.billApiService
      .getRecommendedBillConfigs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (bills) => {
          this.recommendedBills.set(bills);
          this.billsLoading.set(false);
        },
        error: () => {
          this.recommendedBills.set([]);
          this.billsLoading.set(false);
        },
      });
  }

  onFilterClicked(filter: HubFilterModel): void {
    if (filter.id === this.selectedFilter()?.id) {
      this.selectedFilter.set(null);
      this.setFilterInUrl();
      return;
    }
    this.filterComponent.scrollToStartScroll();
    this.selectedFilter.set(filter);
    this.setFilterInUrl();
  }
  onAllServicesClicked(): void {
    this.selectedFilter.set(null);
    this.setFilterInUrl();
  }

  private getServices(): void {
    this.appServiceService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.allServices.set(result);
          this.isLoading.set(false);
        },
      });
  }
  gotoSearch(): void {
    this.router.navigate(['/hub/search']).then();
  }
  onServiceClicked(service: CategorizedServiceItemInterface): void {
    if ('status' in service.data) {
      const status = service.data.status;
      const isClickable = status !== this.AppServiceStatus.DISABLED && status !== this.AppServiceStatus.NO_ACTION;
      if (!isClickable) return;
      this.eventManagementService.triggerEvent({
        eventType: 'click',
        breadCrumbs: ['hub', 'all-services'],
        data: {
          target: `service: ${service.data.title}`,
        },
      });
      this.actionHandlerService
        .handle({
          type: ActionType.GO_TO_SERVICE,
          payload: {
            serviceId: service.data.id,
            params: {
              [CallbackInstallmentsOverviewKey]: '/hub',
            },
          },
        })
        .then();
    }
    if (service.type === 'bill') {
      this.handleBill(service);
    }
  }
  handleBill(bill: CategorizedServiceItemInterface): void {
    this.billService.recommendationClick(bill.data);
  }

  setFilterInUrl(): void {
    if (this.selectedFilter()) {
      this.router
        .navigate([], {
          queryParams: { filter: this.selectedFilter()?.id },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        })
        .then();
    } else {
      this.router
        .navigate([], {
          queryParams: { filter: null },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        })
        .then();
    }
  }
  protected readonly AppServiceStatus = AppServiceStatusEnum;
  protected readonly appServicesCategoriesConst = appServicesCategoriesConst;
  protected readonly AppServiceCategoryNamesEnum = AppServiceCategoryNamesEnum;
  protected readonly ServiceImagesType = ServiceImagesType;
}
