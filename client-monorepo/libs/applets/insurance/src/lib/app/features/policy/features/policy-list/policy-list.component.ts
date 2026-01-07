import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { InsuranceTabEnum } from '../../data-access/enums/policy-list.enum';
import { EmptyResultComponent } from '../../../../components/empty-result/empty-result.component';
import { PolicyCardComponent } from './components/policy-card/policy-card.component';
import { FullScreenLoadingComponent } from '../../../../components/full-screen-loading/full-screen-loading.component';
import { InsuranceTabModel } from '../../../../data-access/models/insurance-tab.model';
import { BaseComponent } from '../../../../components/base/base.component';
import { TABS } from '../../data-access/models/policy-list.const';
import { PolicyProductCardModel } from '../../data-access/models/policy-product-card.model';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { Observable, zip } from 'rxjs';
import { DpxService } from '../../../../data-access/services/dpx.service';
import { MainHeaderComponent } from '../../../../components/main-header/main-header.component';
import { BottomNavigationService } from '../../../../data-access/services/bottom-navigation.service';
import { HeaderService } from '../../../../data-access/services/header.service';
import { InsuranceProductTypeEnum, InsuranceProductTypeLabelEnum } from '../../../../data-access/enums/Insurance-product-type.enum';
import { FeatureToggleService } from '../../../../data-access/services/feature-toggle.service';
import { NgxSegmentedControlComponent } from '@digipay/ngx-segmented-control';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { ListOptionEnum } from '../../data-access/enums/list-option.enum';
import { PolicyListProductInfo } from './data-access/models/policy-list-product-card.model';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { PolicySortBottomSheetComponent } from './components/policy-sort-bottom-sheet/policy-sort-bottom-sheet.component';
import { PolicySortEnum } from './data-access/enums/policy-sort.enum';
import { PolicyFilterBottomSheetComponent } from './components/policy-filter-bottom-sheet/policy-filter-bottom-sheet.component';
import { PolicyFilterOptionModel } from './data-access/models/policy-filter-option.model';
import { PolicyListDataService } from './data-access/services/policy-list-data.service';
import { PRODUCT_ICON_MAP } from './data-access/constants/product-icon-map.constant';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { NavigationService } from '../../../../data-access/services/navigation.service';
import { PolicyListKeys } from './data-access/enums/policy-list-keys.enum';
import { ScrollDirectionDirective } from '../../../../data-access/directives/scroll-direction.directive';
import { CloseService } from '../../../vehicle/data-access/services/shared/close.service';
import { AuthService } from '@client-monorepo/common/user';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'policy-list',
  standalone: true,
  imports: [
    PolicyCardComponent,
    EmptyResultComponent,
    NgClass,
    FullScreenLoadingComponent,
    MainHeaderComponent,
    NgxSegmentedControlComponent,
    NgxIcon,
    NgxChipComponent,
    ScrollDirectionDirective,
  ],
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.scss',
})
export class PolicyListComponent extends BaseComponent implements OnInit, OnDestroy {
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  readonly tabs = signal<ReadonlyArray<InsuranceTabModel>>(TABS);
  readonly MAXIMUM_POLICY_LIST_LENGTH = 20;
  cards = signal<(PolicyProductCardModel<any> | PolicyListProductInfo)[]>([]);

  isPolicyListProductInfo(card: PolicyProductCardModel<any> | PolicyListProductInfo): card is PolicyListProductInfo {
    return 'name' in card && 'icon' in card;
  }

  asPolicyProductCard(card: PolicyProductCardModel<any> | PolicyListProductInfo): PolicyProductCardModel<any> {
    return card as PolicyProductCardModel<any>;
  }

  asPolicyListProductInfo(card: PolicyProductCardModel<any> | PolicyListProductInfo): PolicyListProductInfo {
    return card as PolicyListProductInfo;
  }

  isLoggedIn = signal(false);
  loading = signal(false);
  titleCard = signal<string>('');
  selectSortMethod: PolicySortEnum = PolicySortEnum.DESC;
  selectedFilterOptions = signal<PolicyFilterOptionModel[]>([
    {
      title: InsuranceProductTypeLabelEnum[InsuranceProductTypeEnum.ThirdParty],
      value: InsuranceProductTypeEnum.ThirdParty,
      isChecked: false,
    },
    {
      title: InsuranceProductTypeLabelEnum[InsuranceProductTypeEnum.ThirdPartyMotor],
      value: InsuranceProductTypeEnum.ThirdPartyMotor,
      isChecked: false,
    },
    {
      title: InsuranceProductTypeLabelEnum[InsuranceProductTypeEnum.Body],
      value: InsuranceProductTypeEnum.Body,
      isChecked: false,
    },
    {
      title: InsuranceProductTypeLabelEnum[InsuranceProductTypeEnum.Equipment],
      value: InsuranceProductTypeEnum.Equipment,
      isChecked: false,
    },
    {
      title: InsuranceProductTypeLabelEnum[InsuranceProductTypeEnum.HouseIncidents],
      value: InsuranceProductTypeEnum.HouseIncidents,
      isChecked: false,
    },
  ]);
  listOptions = signal<(SegmentItemsModel & { value: ListOptionEnum })[]>([
    {
      text: 'خریداری شده',
      value: ListOptionEnum.PURCHASED,
      id: 0,
    },
    {
      text: 'در انتظار تمدید',
      value: ListOptionEnum.RENEWAL,
      id: 1,
    },
    {
      text: 'خریدهای ناتمام',
      value: ListOptionEnum.UNCOMPLETE,
      id: 2,
    },
  ]);

  selectedOption = signal<SegmentItemsModel & { value: ListOptionEnum }>(this.listOptions()[0]);
  isFilterChipActive = signal<boolean>(false);
  hasAnyFilterSelected = signal<boolean>(false);
  public bottomNavigationService = inject(BottomNavigationService);
  public dpxService = inject(DpxService);
  private digikalaService = inject(InsDigikalaService);
  private closeService = inject(CloseService);
  private bottomSheetService = inject(BottomSheetService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private policyListDataService = inject(PolicyListDataService);
  private featureToggleService = inject(FeatureToggleService);
  public headerService = inject(HeaderService);
  private navigationService = inject(NavigationService);
  private authService = inject(AuthService);
  protected readonly hideIconRight = signal(this.digikalaService.isDigikala);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.toggleNewFeatures();
    this.setupNavigation();
    this.checkLogin();
    this.applyQueryParams();
    this.imposeDigikalaLimitations();
    this.getPolicyList(this.selectedOption().value);
  }

  imposeDigikalaLimitations(): void {
    if (this.digikalaService.isDigikala) {
      this.listOptions.update((prev) => prev.filter((option) => option.value !== ListOptionEnum.RENEWAL));
    }
  }

  applyQueryParams(): void {
    this.applyQueryParamsFilter();
    this.applyQueryParamsSortMethod();
    this.applyQueryParamsListOption();
  }

  changeListOption($event: SegmentItemsModel & { value: ListOptionEnum }): void {
    const prevSelectedOption = this.selectedOption();
    this.selectedOption.set(this.listOptions().find((option) => option.value === $event.value));
    this.updateQueryParams(PolicyListKeys.SORT_METHOD, this.selectSortMethod);
    if (this.loading()) {
      setTimeout(() => this.selectedOption.set(prevSelectedOption), 0);
      return;
    }
    this.getPolicyList($event.value);
  }

  private applyQueryParamsSortMethod(): void {
    const sortMethod: PolicySortEnum = this.activatedRoute.snapshot.queryParams[PolicyListKeys.SORT_METHOD];
    if (!sortMethod) {
      this.updateQueryParams(PolicyListKeys.SORT_METHOD, this.selectSortMethod);
      return;
    }
    this.selectSortMethod = sortMethod;
  }

  private applyQueryParamsListOption(): void {
    const listOption: ListOptionEnum = this.activatedRoute.snapshot.queryParams[PolicyListKeys.LIST_OPTION];
    if (!listOption) {
      this.updateQueryParams(PolicyListKeys.LIST_OPTION, this.selectedOption().value.toString());
      return;
    }
    this.selectedOption.set(this.listOptions().find((option) => option.value === +listOption));
  }

  private applyQueryParamsFilter(): void {
    const productKeys: string[] | string = this.activatedRoute.snapshot.queryParams[PolicyListKeys.PRODUCTS];
    if (!productKeys || productKeys.length === 0) {
      return;
    }
    this.isFilterChipActive.set(true);
    this.selectedFilterOptions().forEach((option) => {
      if (
        (typeof productKeys === 'string' && option.value === productKeys) ||
        (Array.isArray(productKeys) && productKeys.find((key) => option.value === key))
      ) {
        option.isChecked = true;
      }
    });
  }

  private getPolicyList(type: ListOptionEnum): void {
    this.loading.set(true);
    if (!this.isLoggedIn()) {
      this.loading.set(false);
      return;
    }
    this.setFilterParams();
    zip(this.createProductDataObservables(type)).subscribe({
      next: (lists) => {
        this.cards.set(this.combineProductPolicies(lists));
        this.loading.set(false);
      },
      error: (err) => {
        this.cards.set([]);
        this.loading.set(false);
      },
    });
  }

  createProductDataObservables(type: ListOptionEnum): Observable<any>[] {
    const filterOptionProductDataMap = {
      [InsuranceProductTypeEnum.ThirdParty]: this.policyListDataService.getThirdPartyPolicyList(type, this.selectSortMethod),
      [InsuranceProductTypeEnum.ThirdPartyMotor]: this.policyListDataService.getThirdPartyMotorPolicyList(type, this.selectSortMethod),
      [InsuranceProductTypeEnum.Body]: this.policyListDataService.getCarBodyPolicyList(type, this.selectSortMethod),
      [InsuranceProductTypeEnum.HouseIncidents]: this.policyListDataService.getHouseIncidentPolicyList(type, this.selectSortMethod),
      [InsuranceProductTypeEnum.Equipment]: this.policyListDataService.getEquipmentPolicyList(type, this.selectSortMethod),
    };

    const filteredData = [];
    this.hasAnyFilterSelected.set(false);
    this.selectedFilterOptions().forEach((option) => {
      if (option.isChecked) {
        this.hasAnyFilterSelected.set(true);
        filteredData.push(filterOptionProductDataMap[option.value]);
      }
    });
    if (this.hasAnyFilterSelected()) {
      return filteredData;
    }
    this.selectedFilterOptions().forEach((option) => {
      filteredData.push(filterOptionProductDataMap[option.value]);
    });
    return filteredData;
  }

  combineProductPolicies(lists: PolicyProductCardModel<any>[][]): (PolicyProductCardModel<any> | PolicyListProductInfo)[] {
    const infoList = [];
    this.selectedFilterOptions().forEach((option) => {
      if (option.isChecked || !this.hasAnyFilterSelected()) {
        infoList.push({ icon: PRODUCT_ICON_MAP[option.value], name: 'بیمه ' + option.title });
      }
    });
    const tempList = [];
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].length > 0) {
        tempList.push(infoList[i]);
      }
      tempList.push(...lists[i].slice(0, this.MAXIMUM_POLICY_LIST_LENGTH));
    }
    return tempList;
  }

  setFilterParams(): void {
    const filteredProducts = this.selectedFilterOptions()
      .filter((option) => option.isChecked)
      .map((option) => option.value);
    this.navigationService.replace([], {
      queryParams: {
        [PolicyListKeys.SORT_METHOD]: this.selectSortMethod,
        [PolicyListKeys.PRODUCTS]: filteredProducts,
        [PolicyListKeys.LIST_OPTION]: this.selectedOption()?.value ?? this.listOptions()[0]?.value,
      },
    });
  }

  toggleNewFeatures(): void {
    this.featureToggleService.featureToggle$.subscribe({
      next: (value) => {
        this.tabs.set(TABS.filter((tab) => (value ? true : tab.value !== InsuranceTabEnum.THIRD_PARTY_MOTOR)));
      },
    });
  }

  setupNavigation(): void {
    if (!this.dpxService.IsEnteredFromDpx) {
      this.bottomNavigationService.setup();
    }
  }

  backButtonClicked(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.closeService.close();
    } else {
      window.history.back();
    }
  }

  sortButtonClicked(): void {
    this.bottomSheetService
      .open(
        BottomSheetBoxComponent,
        {
          component: PolicySortBottomSheetComponent,
          name: 'PolicySort',
          title: 'مرتب سازی',
          data: {
            selectedSortMethod: this.selectSortMethod,
          },
        },
        {
          showHolderIcon: false,
        },
      )
      .afterDismissed()
      .subscribe({
        next: (value) => {
          if (!value) {
            return;
          }
          this.selectSortMethod = value;
          this.updateQueryParams(PolicyListKeys.SORT_METHOD, this.selectSortMethod);
          this.getPolicyList(this.selectedOption().value);
        },
      });
  }

  updateQueryParams(key: string, value: string): void {
    this.navigationService.replace([], {
      queryParams: {
        [key]: value,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterButtonClicked(): void {
    this.bottomSheetService
      .open(
        BottomSheetBoxComponent,
        {
          component: PolicyFilterBottomSheetComponent,
          name: 'PolicyFilter',
          title: 'فیلترها',
          data: {
            filterOptions: this.selectedFilterOptions(),
          },
        },
        {
          showHolderIcon: false,
        },
      )
      .afterDismissed()
      .subscribe({
        next: (options: PolicyFilterOptionModel[]) => {
          if (!options) {
            return;
          }
          this.selectedFilterOptions.set(structuredClone(options));
          this.isFilterChipActive.set(options.length > 0 && !!options.find((option) => option.isChecked));
          this.getPolicyList(this.selectedOption().value);
        },
      });
  }

  deleteFilters(): void {
    this.selectedFilterOptions().forEach((option) => (option.isChecked = false));
    this.isFilterChipActive.set(false);
    this.getPolicyList(this.selectedOption().value);
  }

  public handleLoginClicked(): void {
    this.loginService.routeToLoginPage();
  }

  private checkLogin(): void {
    this.isLoggedIn.set(this.authService.isLoggedIn());
  }

  routeToHome(): void {
    this.router.navigate(['/'], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.cleanUp();
    super.ngOnDestroy();
  }
}
