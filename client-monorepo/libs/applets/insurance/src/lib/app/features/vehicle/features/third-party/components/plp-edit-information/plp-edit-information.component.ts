import { Component, computed, ElementRef, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { OwnershipChangedFormComponent } from '../ownership-changed-form/ownership-changed-form.component';
import { DiscountDetailFormComponent } from '../discount-detail-form/discount-detail-form.component';
import { ExInsurerDateFormComponent } from '../ex-insurer-date-form/ex-insurer-date-form.component';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { ClaimDetailFormComponent } from '../claim-detail-form/claim-detail-form.component';
import { InsuranceTabsComponent } from '../../../../../../components/insurance-tabs/insurance-tabs.component';
import { ApplicationFormApiService } from '../../../../data-access/services/third-party/application-form-api.service';
import { ExInsurerFormComponent } from '../ex-insurer-form/ex-insurer-form.component';
import { DiscountFormComponent } from '../discount-form/discount-form.component';
import { CarInfoFormComponent } from '../car-info-form/car-info-form.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { InsuranceTabModel } from '../../../../../../data-access/models/insurance-tab.model';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { FormValidatorsService } from '../../data-access/services/form-validators.service';
import { PlateService } from '../../data-access/services/plate.service';
import { StoreService } from '../../data-access/services/store.service';
import { ApplicationFormPutRequestModel } from '../../../../data-access/models/application-form/application-form-put-request.model';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import moment from 'jalali-moment';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'plp-edit-information',
  standalone: true,
  imports: [
    InsuranceTabsComponent,
    CarInfoFormComponent,
    ExInsurerFormComponent,
    ExInsurerDateFormComponent,
    OwnershipChangedFormComponent,
    DiscountFormComponent,
    DiscountDetailFormComponent,
    ClaimFormComponent,
    ClaimDetailFormComponent,
    ActionButtonsComponent,
    NgxPlateComponent,
  ],
  templateUrl: './plp-edit-information.component.html',
  styleUrl: './plp-edit-information.component.scss',
})
export class PlpEditInformationComponent extends BaseComponent implements OnInit {
  private modal = inject(MatDialogRef<PlpEditInformationComponent>);
  public data = inject(MAT_DIALOG_DATA);

  private formValidator = inject(FormValidatorsService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private messageService = inject(MessageService);
  private fb = inject(UntypedFormBuilder);
  private storeService = inject(StoreService);
  private plateService = inject(PlateService);
  private appFieldApiService = inject(ApplicationFormApiService);
  private constantAllService = inject(ConstantAllService);
  protected readonly extraInsurerForm = ExtraInsurerForm;
  protected readonly IconEnum = IconEnum;
  plate: string | null = null;
  tabs: InsuranceTabModel[] = [
    {
      title: 'خودرو',
      value: 1,
    },
    {
      title: 'بیمه‌نامه قبلی',
      value: 2,
    },
  ];
  activeTab = 1;
  showError = false;
  carInfoForm = this.fb.group({});
  exInsurerForm = this.fb.group({});
  exInsurerDateForm = this.fb.group({});
  ownershipChangedForm = this.fb.group({});
  discountForm = this.fb.group({});
  discountDetailForm = this.fb.group({});
  claimForm = this.fb.group({});
  claimDetailForm = this.fb.group({});

  exInsurerFormValue = signal<string>(null);
  ownershipChangedFormValue = signal<number>(null);
  discountFormValue = signal<number>(null);
  showExInsurerForms = computed<boolean>(
    () => !(this.exInsurerFormValue() === ExtraInsurerForm.NewCar || this.exInsurerFormValue() === ExtraInsurerForm.NoInsurance),
  );
  showDiscountForm = computed<boolean>(() => !!this.ownershipChangedFormValue());
  showDiscountDetailForm = computed<boolean>(() => {
    return !this.ownershipChangedFormValue() || !!this.discountFormValue();
  });

  constructor() {
    super();
  }

  handleChangeTab(tab: number): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.handleChangeTab(this.data.data?.activeTab ?? 1);
    this.subscribeOnFormsChange();
    this.getPlate();
  }

  subscribeOnFormsChange(): void {
    super.addSubscription(
      this.exInsurerForm?.valueChanges.subscribe({
        next: (value) => {
          this.exInsurerFormValue.set(value.name);
        },
      }),
    );

    super.addSubscription(
      this.ownershipChangedForm?.valueChanges.subscribe({
        next: (value) => {
          this.ownershipChangedFormValue.set(value.ownershipChanged);
        },
      }),
    );

    super.addSubscription(
      this.discountForm?.valueChanges.subscribe({
        next: (value) => {
          this.discountFormValue.set(value.discount);
          if (value.discount === 0) {
            this.discountDetailForm?.controls.thirdPartyDiscount?.setValue(null);
            this.discountDetailForm?.controls.driverDiscount?.setValue(null);
          }
        },
      }),
    );

    super.addSubscription(
      this.claimForm?.valueChanges.subscribe({
        next: (value) => {
          if (value.claim === 0) {
            this.claimDetailForm?.controls.propertyDamage?.setValue(this.constantAllService.propertyDamageDefaultValue);
            this.claimDetailForm?.controls.driverDamage?.setValue(this.constantAllService.driverDamageDefaultValue);
            this.claimDetailForm?.controls.healthDamage?.setValue(this.constantAllService.healthDamageDefaultValue);
          }
        },
      }),
    );
  }

  handleDeActiveButtonClicked(): void {
    this.modal.close(false);
  }

  handleActiveButtonClicked(): void {
    if (this.areFormsInValid()) {
      this.handleInvalidForms();
      return;
    }
    const withoutOldInsurance: boolean = this.isWithoutOldInsurance();
    let discount = null;
    let claim = null;
    if (!withoutOldInsurance) {
      if (!this.formValidator.claimDetailValidator(this.claimDetailForm)) {
        this.activeTab = 2;
        setTimeout(() => {
          this.scrollToElement('claim-detail');
        }, 0);
        this.messageService.showErrorMessage('کاربر گرامی، همه گزینه‌ها نمی‌تواند فاقد خسارت باشد.', 'vehicle-message');
        return;
      }

      discount = this.ownershipChangedForm?.controls.ownershipChanged?.value === 0 ? 1 : this.discountForm?.controls.discount?.value;

      claim = this.claimForm?.controls?.claim?.value;
    }

    const newData: ApplicationFormPutRequestModel = {
      applicationFormId: this.storeService.getFormId(),
      vehicleInfo: {
        carBuildYear: this.carInfoForm?.controls?.buildYear?.value?.toString(),
        carModelId: this.carInfoForm?.controls?.model?.value,
        vehicleOwnerChanged: !!this.ownershipChangedForm?.controls?.ownershipChanged?.value,
        carUsageId: this.carInfoForm?.controls?.usage?.value,
        releaseDate:
          this.exInsurerForm.controls.name?.value === ExtraInsurerForm.NewCar
            ? moment(this.exInsurerForm?.controls?.releaseDate?.value, 'jYYYY/jMM/jDD').locale('en').format('YYYY/MM/DD')
            : null,
      },
      previousInsuranceDetail: {
        insurerParty: {
          insurerPartyId: withoutOldInsurance ? null : this.exInsurerForm?.controls?.name?.value,
        },
        startsAt: moment(this.exInsurerDateForm?.controls?.start?.value, 'jYYYY/jMM/jDD').locale('en').valueOf(),
        endsAt: moment(this.exInsurerDateForm?.controls?.end?.value, 'jYYYY/jMM/jDD').locale('en').valueOf(),
        driverDiscountId: discount
          ? this.discountDetailForm?.controls?.driverDiscount?.value
          : this.constantAllService.driverDiscountDefaultValue(),
        driverDamageId: !withoutOldInsurance
          ? claim
            ? this.claimDetailForm?.controls?.driverDamage?.value
            : this.constantAllService.driverDamageDefaultValue()
          : null,
        healthDamageId: !withoutOldInsurance
          ? claim
            ? this.claimDetailForm?.controls?.healthDamage?.value
            : this.constantAllService.healthDamageDefaultValue()
          : null,
        propertyDamageId: !withoutOldInsurance
          ? claim
            ? this.claimDetailForm?.controls?.propertyDamage?.value
            : this.constantAllService.propertyDamageDefaultValue()
          : null,
        thirdPartyDiscountId: discount
          ? this.discountDetailForm?.controls?.thirdPartyDiscount?.value
          : this.constantAllService.thirdPartyDiscountDefaultValue(),
      },
    };

    if (this.checkChangeValues(newData)) {
      this.modal.close(false);
      return;
    }

    super.addSubscription(
      this.appFieldApiService.putApplicationForm(newData).subscribe({
        next: (res) => {
          res.result.coverageRateId = this.data?.data?.coverageRateId;
          res.result.durationId = this.data?.data?.durationId;
          this.storeService.setStoreData(res.result);
          this.modal.close(true);
        },
      }),
    );
  }

  isWithoutOldInsurance(): boolean {
    return (
      this.exInsurerForm.controls.name.value === ExtraInsurerForm.NewCar ||
      this.exInsurerForm.controls.name.value === ExtraInsurerForm.NoInsurance
    );
  }

  areFormsInValid(): boolean {
    return (
      this.carInfoForm.invalid ||
      this.exInsurerForm.invalid ||
      (!this.isWithoutOldInsurance() && this.exInsurerDateForm.invalid) ||
      (!this.isWithoutOldInsurance() && this.ownershipChangedForm.invalid) ||
      this.discountForm.invalid ||
      ((this.ownershipChangedForm.controls.ownershipChanged?.value === 0 || this.discountForm?.controls.discount?.value === 1) &&
        this.discountDetailForm.invalid) ||
      (this.claimForm.controls.claim?.value === 1 && this.claimDetailForm.invalid)
    );
  }

  handleInvalidForms(): void {
    this.activeTab = this.carInfoForm.invalid ? 1 : 2;
    this.showError = true;
    setTimeout(() => {
      if (this.exInsurerForm.invalid) {
        this.scrollToElement('ex-insurer');
        return;
      }

      if (this.exInsurerDateForm.invalid) {
        this.scrollToElement('ex-insurer-date');
        return;
      }

      if (this.discountDetailForm.invalid) {
        this.scrollToElement('discount-detail');
        return;
      }

      if (this.claimDetailForm.invalid) {
        this.scrollToElement('claim-detail');
        return;
      }
    }, 0);
  }

  getPlate(): void {
    super.addSubscription(
      this.plateService.getPlate().subscribe({
        next: (res) => {
          this.plate = res ?? null;
        },
      }),
    );
  }

  scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  checkChangeValues(data: ApplicationFormPutRequestModel): boolean {
    const vehicleInfo = this.storeService.getStoreValue().vehicleInfo;
    const exInsurer = this.storeService.getStoreValue().previousInsurance;
    return (
      data.vehicleInfo.carBuildYear === vehicleInfo.buildYear &&
      data.vehicleInfo.carModelId === vehicleInfo.carModel.id &&
      data.vehicleInfo.vehicleOwnerChanged === vehicleInfo.ownershipChanged &&
      data.vehicleInfo.carUsageId === vehicleInfo.carUsage.id &&
      data.vehicleInfo.releaseDate === vehicleInfo.releaseDate &&
      data.previousInsuranceDetail.insurerParty.insurerPartyId === exInsurer.company.id &&
      data.previousInsuranceDetail.startsAt === exInsurer.startsAt &&
      data.previousInsuranceDetail.endsAt === exInsurer.endsAt &&
      data.previousInsuranceDetail.driverDiscountId === exInsurer.driverDiscount.id &&
      data.previousInsuranceDetail.thirdPartyDiscountId === exInsurer.thirdPartyDiscount.id &&
      data.previousInsuranceDetail.driverDamageId === exInsurer.driverDamage.id &&
      data.previousInsuranceDetail.healthDamageId === exInsurer.healthDamage.id &&
      data.previousInsuranceDetail.propertyDamageId === exInsurer.propertyDamage.id
    );
  }
}
