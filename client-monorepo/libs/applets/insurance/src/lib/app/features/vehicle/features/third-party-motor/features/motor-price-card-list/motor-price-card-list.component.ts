import { ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, tap, timer } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import {
  FilterButtonComponent
} from '../../../third-party/features/price-card-list/components/filter-button/filter-button.component';
import {
  SortButtonComponent
} from '../../../third-party/features/price-card-list/components/sort-button/sort-button.component';
import {
  NotFoundInsuranceCompanyComponent
} from '../../../third-party/features/price-card-list/components/not-found-insurance-company/not-found-insurance-company.component';
import {
  ErrorRetryComponent
} from '../../../third-party/features/price-card-list/components/error-retry/error-retry.component';
import { FullscreenLoadingComponent } from '../../../../components/fullscreen-loading/fullscreen-loading.component';
import {
  GiftInfoBottomSheetComponent
} from '../../../third-party/features/price-card-list/components/gift-info/gift-info-bottom-sheet.component';
import { CarDataModel } from '../../../../data-access/models/third-party/constant-all/car-data.model';
import { BusinessValueModel } from '../../../../../../data-access/models/business-value.model';
import { SortMethod } from '../../../third-party/features/price-card-list/data-access/enums/SortMethod';
import {
  InsuranceCompanyModel
} from '../../../../data-access/models/third-party/available-products/insurance-company.model';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import {
  FaqLimitAndDurationBottomSheetComponent
} from '../../../third-party/features/price-card-list/components/faq-limit-and-duration-bottom-sheet/faq-limit-and-duration-bottom-sheet.component';
import {
  FilterBottomSheetComponent
} from '../../../third-party/features/price-card-list/components/filter-bottom-sheet/filter-bottom-sheet.component';
import { PlpCardItemComponent } from '../../../../components/plp-card-item/plp-card-item.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import { PriceTransformerPipe } from '../../../../pipes/price-transformer.pipe';
import {
  ProductCardGiftModel
} from '../../../../data-access/models/third-party/available-products/product-card-gift.model';
import { VehicleErrorCode } from '../../../../data-access/enums/vehicle-error-code.enum';
import { ProductCardModel } from '../../../../data-access/models/third-party/available-products/product-card.model';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { ThirdPartyMotorKeysEnum } from '../../data-access/enums/third-party-motor-keys.enum';
import { THIRD_PARTY_MOTOR_ROUTE } from '../../data-access/constants/third-party-motor-route.const';
import { BottomSheetBoxComponent } from '../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { ModalService } from '../../../../data-access/services/modal.service';
import { EditMotorInfoModalComponent } from '../../components/edit-motor-info-modal/edit-motor-info-modal.component';
import { SortBottomSheetComponent } from '../../../../components/sort-bottom-sheet/sort-bottom-sheet.component';

@Component({
  selector: 'motor-price-card-list',
  standalone: true,
  imports: [
    InsIconComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgTemplateOutlet,
    NgxSkeletonLoadingComponent,
    NgxTooltipDirective,
    FilterButtonComponent,
    SortButtonComponent,
    NotFoundInsuranceCompanyComponent,
    PlpCardItemComponent,
    ErrorRetryComponent,
    FullscreenLoadingComponent,
    NgxIcon,
  ],
  templateUrl: './motor-price-card-list.component.html',
  styleUrl: './motor-price-card-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MotorPriceCardListComponent extends ThirdPartyMotorDirective implements OnInit {
  private constantAllServices = inject(ConstantAllService);
  private bottomSheetService = inject(BottomSheetService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);

  isLoading = signal(false);
  hasError = signal(false);
  isRoutingToOrderPage = signal(false);
  motorInfo = signal<CarDataModel | null>(null);
  filteredInsuranceItems = signal<any[]>([]);
  selectedCompaniesFilter = signal<InsuranceCompanyModel[]>([]);
  selectedSortMethod = signal<SortMethod | null>(null);
  insuranceCompanies: WritableSignal<Partial<InsuranceCompanyModel>[]> = signal([]);
  protected businessValueItems = signal<BusinessValueModel[]>([
    {
      icon: IconEnum.Rocket,
      text: 'صدور آنی',
      color: AlertColorEnum.Green
    },
    {
      icon: IconEnum.BnplDue,
      text: 'پرداخت اقساطی',
      color: AlertColorEnum.Green
    }
  ]);

  form: FormGroup | null = null;
  coverageRateInputList = new BehaviorSubject<FormFieldOption[]>([]);
  durationInputList = new BehaviorSubject<FormFieldOption[]>([]);
  IconEnum = IconEnum;
  private insuranceItems: Array<ProductCardModel> = [];
  private interval: number;
  protected readonly AlertSizeEnum = AlertSizeEnum;

  ngOnInit(): void {
    this.initializeForm();
    this.initialConstantConfig();
    this.subscribeOnFormChanged();
    this.getDataFromStore();
    super.addSubscription(this.route.fragment.subscribe(fragment => {
      if (fragment === 'edit-car-info') {
        this.editMotorInfoClicked();
      }
    }));
  }

  private initialConstantConfig(): void {
    super.addSubscription(this.constantAllServices.getConstantAll().subscribe({
      next: res => {
        this.durationInputList.next(this.convertInputValuesToFormFieldOption(res?.durations));
        this.coverageRateInputList.next(this.convertInputValuesToFormFieldOption(res?.coverageRates, true));
        this.insuranceCompanies.set(res?.insuranceCompanies);
      }
    }));
  }

  private convertInputValuesToFormFieldOption(arr: CarDataModel[], isCoverage?: boolean): FormFieldOption[] {
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

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      coverageRate: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  private subscribeOnFormChanged(): void {
    super.addSubscription(this.form?.valueChanges?.subscribe({
      next: () => this.getAvailableProducts()
    }));
  }

  private getDataFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.motorInfo.set({
          title: value?.vehicleInfo.type || '',
          id: value?.vehicleInfo.typeId || null,
          defaultValue: false
        });
        this.form.setValue({
          coverageRate: value?.coverageRateId || (this.coverageRateInputList.getValue()[0]?.value ?? null),
          duration: value?.durationId || (this.durationInputList.getValue()[this.durationInputList.getValue().length - 1]?.value ?? null)
        });
      }
    }));
  }

  private getAvailableProducts(): void {
    if (!this.storeService.getStoreData() || this.form.invalid) {
      return;
    }
    this.isLoading.set(true);
    super.addSubscription(this.motorApiService.postAvailableProducts({
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

  protected onSelectCard(insuranceCompanyId: number): void {
    this.isRoutingToOrderPage.set(true);
    this.router.navigate([THIRD_PARTY_MOTOR_ROUTE.GoToCheckout], {
      relativeTo: this.activatedRoute.parent,
      queryParamsHandling: 'merge',
      queryParams: {
        [ThirdPartyMotorKeysEnum.FormId]: this.storeService.getFormId(),
        [ThirdPartyMotorKeysEnum.InsuranceCompanyId]: insuranceCompanyId.toString()
      }
    }).then();
  }

  deleteFilters(): void {
    this.selectedCompaniesFilter.set([]);
    this.filterPlpCardByName();
  }

  handleCloseClicked(): void {
    this.onClose();
  }

  protected onClose(): void {
    this.closeService.close();
  }

  protected onNext(route: string): void {
  }

  editMotorInfoClicked(): void {
    const dialogRef = this.modalService.open(BottomSheetBoxComponent, {
      component: EditMotorInfoModalComponent,
      name: 'EditMotorInfoModal',
      title: 'ویرایش اطلاعات',
      data: {
        coverageRateId: this.form?.controls?.coverageRate?.value,
        durationId: this.form?.controls?.duration?.value
      }
    }, true);

    this.router.navigate([THIRD_PARTY_MOTOR_ROUTE.PriceCardList], {
      relativeTo: this.activatedRoute.parent,
      fragment: 'edit-motor-info',
      queryParamsHandling: 'merge'
    });

    super.addSubscription(dialogRef.afterClosed().subscribe(() => {
      if (this.route.snapshot.fragment === 'edit-motor-info') {
        this.router.navigate([THIRD_PARTY_MOTOR_ROUTE.PriceCardList], {
          relativeTo: this.activatedRoute.parent,
          fragment: null,
          queryParamsHandling: 'merge'
        });
      }
    }));
  }

  onLimitAndDuration(): void {
    this.bottomSheetService.open(FaqLimitAndDurationBottomSheetComponent, {
      name: 'MotorFaqLimitAndDurationBottomSheet',
      title: 'راهنمای تعهدات جبران خسارت'
    }, {
      closeOnNavigation: true,
    });
  }

  filterButtonClicked(): void {
    const ref = this.bottomSheetService.open(FilterBottomSheetComponent, {
      name: 'filter-companies',
      selectedInsuranceCompanies: this.selectedCompaniesFilter(),
      insuranceCompanies: this.insuranceCompanies(),
    });

    super.addSubscription(ref.afterDismissed().subscribe((result) => {
      if (result) {
        this.selectedCompaniesFilter.set(result);
        this.applyFilters();
      }
    }));
  }

  sortButtonClicked(): void {
    super.addSubscription(this.bottomSheetService.open(SortBottomSheetComponent, {
      name: 'sort-methods',
      data: {
        selectedSortMethod: this.selectedSortMethod()
      }
    }).afterDismissed().subscribe((result) => {
      this.selectedSortMethod.set(result);
      this.applySorting();
    }));
  }

  deleteSortMethod(): void {
    this.selectedSortMethod.set(null);
    this.applySorting();
  }

  private applyFilters(isSorted: boolean = true): void {
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

  private applySorting(): void {
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

  onSelectGift(item: ProductCardGiftModel): void {
    this.bottomSheetService.open(GiftInfoBottomSheetComponent, {
      name: 'gift-info',
      item
    });
  }

  retryClicked(): void {
    this.hasError.set(false);
    this.isLoading.set(true);
  }
}
