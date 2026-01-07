import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ThirdPartyStepperComponent } from '../../components/third-party-stepper/third-party-stepper.component';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FilterButtonComponent } from './components/filter-button/filter-button.component';
import { SortButtonComponent } from './components/sort-button/sort-button.component';
import { FilterBottomSheetComponent } from './components/filter-bottom-sheet/filter-bottom-sheet.component';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { SortMethod } from './data-access/enums/SortMethod';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FaqLimitAndDurationBottomSheetComponent
} from './components/faq-limit-and-duration-bottom-sheet/faq-limit-and-duration-bottom-sheet.component';
import { BottomSheetBoxComponent } from '../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { BaseComponent } from '../../../../../../components/base/base.component';
import {
  NotFoundInsuranceCompanyComponent
} from './components/not-found-insurance-company/not-found-insurance-company.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, tap, timer } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PlpEditInformationComponent } from '../../components/plp-edit-information/plp-edit-information.component';
import { VehicleSharedService } from '../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyKeysEnum } from '../../data-access/enums/third-party-keys.enum';
import { PriceTransformerPipe } from '../../../../pipes/price-transformer.pipe';
import { ErrorRetryComponent } from './components/error-retry/error-retry.component';
import { FullscreenLoadingComponent } from '../../../../components/fullscreen-loading/fullscreen-loading.component';
import { GiftInfoBottomSheetComponent } from './components/gift-info/gift-info-bottom-sheet.component';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { ModalService } from '../../../../data-access/services/modal.service';
import { VehicleErrorCode } from '../../../../data-access/enums/vehicle-error-code.enum';
import { CarDataModel } from '../../../../data-access/models/third-party/constant-all/car-data.model';
import { BusinessValueModel } from '../../../../../../data-access/models/business-value.model';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import {
  AvailableProductsApiService
} from '../../../../data-access/services/third-party/available-products-api.service';
import {
  InsuranceCompanyModel
} from '../../../../data-access/models/third-party/available-products/insurance-company.model';
import { ProductCardModel } from '../../../../data-access/models/third-party/available-products/product-card.model';
import {
  ProductCardGiftModel
} from '../../../../data-access/models/third-party/available-products/product-card-gift.model';
import { StoreService } from '../../data-access/services/store.service';
import { VehicleInfoModel } from '../../data-access/models/vehicle-info.model';
import { NgxIcon } from '@digipay/ngx-icon';
import { ThirdPartyUrlsEnum } from '../../data-access/enums/third-party-urls.enum';
import { PlpCardItemComponent } from '../../../../components/plp-card-item/plp-card-item.component';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import { CloseService } from '../../../../data-access/services/shared/close.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import { SortBottomSheetComponent } from '../../../../components/sort-bottom-sheet/sort-bottom-sheet.component';

@Component({
  selector: 'price-card-list',
  standalone: true,
  imports: [
    ThirdPartyStepperComponent,
    FilterButtonComponent,
    SortButtonComponent,
    InsIconComponent,
    UiFormFieldBuilderModule,
    AsyncPipe,
    ReactiveFormsModule,
    NgxSkeletonLoadingComponent,
    NgTemplateOutlet,
    PlpCardItemComponent,
    NgxTooltipDirective,
    ErrorRetryComponent,
    FullscreenLoadingComponent,
    NotFoundInsuranceCompanyComponent,
    NgxIcon
  ],
  templateUrl: './price-card-list.component.html',
  styleUrl: './price-card-list.component.scss',
})
export class PriceCardListComponent extends BaseComponent implements OnInit {

  private thirdPartySharedService = inject(VehicleSharedService);
  private storeService = inject(StoreService);
  private constantAllService = inject(ConstantAllService);
  private matBottomSheet = inject(BottomSheetService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  private closeService = inject(CloseService);
  private availableProductsApiService = inject(AvailableProductsApiService);
  private queryParamService = inject(QueryParamService);
  private route = inject(ActivatedRoute);

  protected readonly IconEnum = IconEnum;

  coverageRateInputList: BehaviorSubject<FormFieldOption[]> = new BehaviorSubject([]);

  durationInputList: BehaviorSubject<FormFieldOption[]> = new BehaviorSubject([]);

  insuranceCompanies: WritableSignal<Partial<InsuranceCompanyModel>[]> = signal([]);
  vehicleInfo = signal<VehicleInfoModel>(null);
  selectedCompaniesFilter = signal<Partial<InsuranceCompanyModel>[]>([]);
  selectedSortMethod = signal<SortMethod>(null);

  form: FormGroup = this.fb.group({
    coverageRate: [null, [Validators.required]],
    duration: [null, [Validators.required]]
  });
  image: SafeResourceUrl;
  isLoading = signal<boolean>(true);
  hasError = signal<boolean>(false);
  isRoutingToOrderPage = signal<boolean>(false);
  filteredInsuranceItems = signal<Array<ProductCardModel>>(null);
  private insuranceItems: Array<ProductCardModel> = [];
  private interval: number;
  protected readonly AlertSizeEnum = AlertSizeEnum;

  businessValueItems: BusinessValueModel[] = [
    {
      text: 'تخصیص آنی اعتبار',
      icon: IconEnum.Rocket,
      color: AlertColorEnum.Gray
    },
    {
      text: 'پرداخت اقساطی',
      icon: IconEnum.BnplDue,
      color: AlertColorEnum.Gray
    }
  ];

  ngOnInit(): void {
    this.initialConstantConfig();
    this.subscribeOnFormChanged();
    this.getDataFromStore();
    this.initStoreData();

    // Check for fragment and open modal if needed
    super.addSubscription(this.route.fragment.subscribe(fragment => {
      if (fragment === 'edit-car-info') {
        this.editCarInfoClicked();
      }
    }));
  }

  initStoreData(): void {
    this.storeService.loadUnauthorizedApplicationData();
  }

  private initialConstantConfig(): void {
    super.addSubscription(this.constantAllService.getConstantAll().subscribe({
      next: res => {
        this.durationInputList.next(this.convertInputValuesToFormFieldOption(res?.durations));
        this.coverageRateInputList.next(this.convertInputValuesToFormFieldOption(res?.coverageRates, true));
        this.insuranceCompanies.set(res?.insuranceCompanies);
      }
    }));
  }

  subscribeOnFormChanged(): void {
    super.addSubscription(this.form?.valueChanges?.subscribe({
      next: () => this.getAvailableProducts()
    }));
  }

  getDataFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.vehicleInfo.set(value?.vehicleInfo);
        this.form.setValue({
          coverageRate: value?.coverageRate?.id || (this.coverageRateInputList.getValue()[0]?.value ?? null),
          duration: value?.duration?.id || (this.durationInputList.getValue()[this.durationInputList.getValue().length - 1]?.value ?? null)
        });
      }
    }));
  }

  convertInputValuesToFormFieldOption(arr: CarDataModel[], isCoverage?: boolean): FormFieldOption[] {
    const tmp = [];
    const priceTransformerPipe = new PriceTransformerPipe();
    arr.forEach(item => {
      tmp.push({
        title: isCoverage ? priceTransformerPipe.transform(item.title) : item.title,
        value: item.id
      });
    });
    return tmp;
  }

  filterButtonClicked(): void {
    super.addSubscription(this.matBottomSheet.open(FilterBottomSheetComponent, {
      name: 'FilterBottomSheet',
      panelClass: 'filter-bottom-sheet',
      insuranceCompanies: this.insuranceCompanies(),
      selectedInsuranceCompanies: this.selectedCompaniesFilter()
    }).afterDismissed().subscribe({
      next: (result: InsuranceCompanyModel[]) => {
        if (result === undefined) {
          return;
        }
        this.selectedCompaniesFilter.set(result);
        this.filterPlpCardByName();
      }
    }));
  }

  deleteFilters(): void {
    this.selectedCompaniesFilter.set([]);
    this.filterPlpCardByName();
  }

  private filterPlpCardByName(isSorted: boolean = true): void {
    if (this.selectedCompaniesFilter().length === 0) {
      this.filteredInsuranceItems.set(structuredClone(this.insuranceItems));
    } else {
      this.filteredInsuranceItems.set(
        this.insuranceItems?.filter(x =>
          this.selectedCompaniesFilter()?.some(y => y.name === x.company?.name)));
    }
    if (isSorted) {
      this.sortPlpCard();
    }
  }

  sortButtonClicked(): void {
    super.addSubscription(this.matBottomSheet.open(SortBottomSheetComponent, {
      panelClass: 'sort-bottom-sheet',
      name: 'SortBottomSheet',
      data: {
        selectedSortMethod: this.selectedSortMethod()
      }
    }).afterDismissed().subscribe({
      next: (result: SortMethod) => {
        this.selectedSortMethod.set(result);
        this.sortPlpCard();
      }
    }));
  }

  deleteSortMethod(): void {
    this.selectedSortMethod.set(null);
    this.sortPlpCard();
  }

  private sortPlpCard(): void {
    const currentItems = this.filteredInsuranceItems();
    if (!currentItems) {
      return;
    }

    switch (this.selectedSortMethod()) {
      case SortMethod.AscendingCost:
        this.filteredInsuranceItems.set([...currentItems].sort((a, b) => a.price?.total - b.price?.total));
        break;
      case SortMethod.DescendingCost:
        this.filteredInsuranceItems.set([...currentItems].sort((a, b) => b.price?.total - a.price?.total));
        break;
      case SortMethod.DescendingScore:
        this.filteredInsuranceItems.set([...currentItems].sort((a, b) => b.company?.details?.score - a.company?.details?.score));
        break;
      // case SortMethod.DigipayProposal:
      //   this.filteredInsuranceItems.set([...currentItems].sort(x => x.company?.extraDetails?.text?.length > 0 ? -1 : 1));
      //   break;
      case SortMethod.DescendingCompensationBranches:
        this.filteredInsuranceItems.set(
          [...currentItems].sort((a, b) => b.company?.details?.activeBranches - a.company?.details?.activeBranches));
        break;
      default:
        this.filteredInsuranceItems.set(structuredClone(this.insuranceItems));
        this.filterPlpCardByName(false);
        break;
    }
  }

  onLimitAndDuration(): void {
    this.matBottomSheet.open(FaqLimitAndDurationBottomSheetComponent, {
      name: 'FaqLimitAndDurationBottomSheet',
      title: 'راهنمای تعهدات جبران خسارت',
    }, {
      closeOnNavigation: true
    });
  }

  editCarInfoClicked(): void {
    const dialogRef = this.modalService.open(BottomSheetBoxComponent, {
      component: PlpEditInformationComponent,
      name: 'PlpEditInformationModal',
      title: 'ویرایش اطلاعات',
      data: {
        coverageRateId: this.form?.controls?.coverageRate?.value,
        durationId: this.form?.controls?.duration?.value
      }
    }, true);

    this.thirdPartySharedService.navigate('price-card-list', {
      fragment: 'edit-car-info'
    }, InsuranceProductTypeEnum.ThirdParty);

    super.addSubscription(dialogRef.afterClosed().subscribe(() => {
      if (this.route.snapshot.fragment === 'edit-car-info') {
        this.thirdPartySharedService.navigate('price-card-list', {
          fragment: null
        }, InsuranceProductTypeEnum.ThirdParty);
      }
    }));
  }

  public onSelectCard(insuranceCompanyId: number): void {
    this.isRoutingToOrderPage.set(true);
    this.queryParamService.addQueryParams({
      [ThirdPartyKeysEnum.SelectedPLPCardCompanyId]: insuranceCompanyId.toString()
    }).then(() => {
      this.thirdPartySharedService.navigate(ThirdPartyUrlsEnum.PLPCardSelect, null, InsuranceProductTypeEnum.ThirdParty);
    });
  }

  public onSelectGift(item: ProductCardGiftModel): void {
    this.matBottomSheet.open(BottomSheetBoxComponent, {
      name: 'GiftInfoBottomSheet',
      component: GiftInfoBottomSheetComponent,
      title: item.title,
      data: item,
    }, {showHolderIcon: false});
  }

  public retryClicked(): void {
    this.getAvailableProducts();
  }

  handleCloseClicked(): void {
    this.closeService.closeWithCheck();
  }

  getAvailableProducts(): void {
    if (!this.storeService.getStoreValue() || this.form.invalid) {
      return;
    }
    this.isLoading.set(true);
    super.addSubscription(this.availableProductsApiService.postAvailableProducts({
      coverageRateId: this.form?.controls?.coverageRate?.value,
      durationId: this.form?.controls?.duration?.value
    }, this.storeService.getFormId()).pipe(tap(() => {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.insuranceItems = [];
      this.filteredInsuranceItems.set([]);
    })).subscribe({
      next: data => {
        this.interval = data.result.interval;

        if (data.result?.isComplete && data.result?.data === null) {
          this.isLoading.set(false);
          this.hasError.set(true);
          this.insuranceItems = [];
          this.filteredInsuranceItems.set([]);
        }
        this.insuranceItems = data.result?.data ?? [];
        this.filteredInsuranceItems.set(structuredClone(this.insuranceItems));

        if (!data.result?.isComplete) {
          super.addSubscription(timer(this.interval).subscribe(() => {
            this.getAvailableProducts();
          }));
        }

        if (data.result?.isComplete || data.result?.data?.length) {
          this.isLoading.set(false);
        }
        this.selectedSortMethod.set(SortMethod.AscendingCost);
        this.sortPlpCard();
      },
      error: err => {
        if (err?.error?.code === VehicleErrorCode.PriceQuerySessionNotFound) {
          return;
        }
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    }));
  }
}
