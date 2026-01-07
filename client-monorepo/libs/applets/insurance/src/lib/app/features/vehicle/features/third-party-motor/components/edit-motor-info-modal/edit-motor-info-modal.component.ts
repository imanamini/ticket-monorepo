import { Component, computed, ElementRef, inject, OnInit, signal } from '@angular/core';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { InsuranceTabsComponent } from '../../../../../../components/insurance-tabs/insurance-tabs.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormValidatorsService } from '../../../third-party/data-access/services/form-validators.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators
} from '@angular/forms';
import { InsuranceTabModel } from '../../../../../../data-access/models/insurance-tab.model';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import { ExInsurerMotorFormComponent } from '../ex-insurer-motor-form/ex-insurer-motor-form.component';
import { ExInsurerMotorDateFormComponent } from '../ex-insurer-motor-date-form/ex-insurer-motor-date-form.component';
import { OwnershipChangedFormComponent } from '../ownership-changed-form/ownership-changed-form.component';
import { DiscountFormComponent } from '../discount-form/discount-form.component';
import { DiscountDetailFormComponent } from '../discount-detail-form/discount-detail-form.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { ClaimDetailFormComponent } from '../claim-detail-form/claim-detail-form.component';
import moment from 'jalali-moment';
import { MotorInfoFormComponent } from '../motor-info-form/motor-info-form.component';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { ApplicationFormMotorPutRequestModel } from '../../data-access/models/application-form-motor-put-request.model';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';

@Component({
  selector: 'edit-motor-info-modal',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ClaimDetailFormComponent,
    ClaimFormComponent,
    DiscountDetailFormComponent,
    DiscountFormComponent,
    InsuranceTabsComponent,
    OwnershipChangedFormComponent,
    FormsModule,
    ReactiveFormsModule,
    ExInsurerMotorFormComponent,
    ExInsurerMotorDateFormComponent,
    MotorInfoFormComponent
  ],
  templateUrl: './edit-motor-info-modal.component.html',
  styleUrl: './edit-motor-info-modal.component.scss'
})
export class EditMotorInfoModalComponent extends ThirdPartyMotorDirective implements OnInit {
  private modal = inject(MatDialogRef<EditMotorInfoModalComponent>);
  public data = inject(MAT_DIALOG_DATA);
  private formValidator = inject(FormValidatorsService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private fb = inject(UntypedFormBuilder);
  protected readonly IconEnum = IconEnum;
  plate: string | null = null;
  tabs: InsuranceTabModel[] = [
    {
      title: 'موتور',
      value: 1,
    },
    {
      title: 'بیمه‌نامه قبلی',
      value: 2,
    }
  ];
  activeTab = signal<number>(1);
  showError = false;
  exInsurerForm = signal(this.fb.group({}));
  exInsurerDateForm = signal(this.fb.group({}));
  ownershipChangedForm = signal(this.fb.group({}));
  discountForm = signal(this.fb.group({}));
  discountDetailForm = signal(this.fb.group({}));
  claimForm = signal(this.fb.group({}));
  claimDetailForm = signal(this.fb.group({}));

  protected readonly ExtraInsurerForm = ExtraInsurerForm;

  motorcycleTypes = signal<Array<FormFieldOption>>([]);
  exInsurerFormValue = signal<string>(null);
  ownershipChangedFormValue = signal<number>(null);
  discountFormValue = signal<number>(null);
  showExInsurerForms = computed<boolean>(() => {
    return !(this.exInsurerFormValue() === ExtraInsurerForm.NewCar || this.exInsurerFormValue() === ExtraInsurerForm.NoInsurance);
  });
  showDiscountForm = computed<boolean>(() => !!this.ownershipChangedFormValue());
  showDiscountDetailForm = computed<boolean>(() => {
    return !this.ownershipChangedFormValue() || !!this.discountFormValue();
  });
  modelMotorCycleForm = signal<FormGroup>(new FormGroup({
    model: new FormControl(null, [Validators.required]),
    buildYear: new FormControl(null, [Validators.required]),
  }));
  public yearList = computed(
    () => {
      const currentYear = new Date().getFullYear();
      const years: Array<FormFieldOption> = [];
      let persianYear: number = moment(new Date())
        .locale('fa')
        .format('YYYY') as unknown as number;
      for (let year = currentYear; year > 2000; year--) {
        years.push({
          title: `${persianYear} (${year.toString()} میلادی)`,
          value: +persianYear
        });
        persianYear--;
      }
      return years;
    }
  );

  ngOnInit(): void {
    this.getTypes();
    this.subscribeOnFormsChange();
  }

  subscribeOnFormsChange(): void {
    super.addSubscription(this.exInsurerForm()?.valueChanges.subscribe({
      next: (value) => {
        this.exInsurerFormValue.set(value.name);
      }
    }));

    super.addSubscription(this.ownershipChangedForm()?.valueChanges.subscribe({
      next: (value) => {
        this.ownershipChangedFormValue.set(value.ownershipChanged);
      }
    }));

    super.addSubscription(this.discountForm()?.valueChanges.subscribe({
      next: value => {
        this.discountFormValue.set(value.discount);
        if (value.discount === 0) {
          this.discountDetailForm()?.controls.thirdPartyDiscount?.setValue(null);
          this.discountDetailForm()?.controls.driverDiscount?.setValue(null);
        }
      }
    }));

    super.addSubscription(this.claimForm()?.valueChanges.subscribe({
      next: value => {
        if (value.claim === 0) {
          this.claimDetailForm()?.controls.propertyDamage?.setValue(this.constantAllService.propertyDamageDefaultValue);
          this.claimDetailForm()?.controls.driverDamage?.setValue(this.constantAllService.driverDamageDefaultValue);
          this.claimDetailForm()?.controls.healthDamage?.setValue(this.constantAllService.healthDamageDefaultValue);
        }
      }
    }));
  }

  getTypes(): void {
    super.addSubscription(this.constantAllService.getMotorTypes().subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.motorcycleTypes.set(value.map(c => ({title: c.title, value: c.id})));
      }
    }));
  }

  handleChangeTab(tab: number): void {
    this.activeTab.set(tab);
  }

  handleDeActiveButtonClicked(): void {
    this.modal.close(false);
  }

  scrollToElement(className: string): void {
    this.elementRef.nativeElement.getElementsByClassName(className)[0]?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  handleActiveButtonClicked(): void {
    let discount = null;
    let claim = null;
    const withoutOldInsurance: boolean = this.exInsurerForm()?.controls?.name?.value === ExtraInsurerForm.NewCar ||
      this.exInsurerForm()?.controls?.name?.value === ExtraInsurerForm.NoInsurance;
    if (withoutOldInsurance && this.exInsurerForm().invalid) {
      this.activeTab.set(2);
      this.showError = true;

      setTimeout(() => {
        if (this.exInsurerForm().invalid) {
          this.scrollToElement('ex-insurer');
        }
      }, 0);
      return;
    } else if (
      !withoutOldInsurance
      && (
        this.modelMotorCycleForm().invalid
        || this.exInsurerForm().invalid
        || this.exInsurerDateForm().invalid
        || this.ownershipChangedForm().invalid
        || this.discountForm().invalid
        || (this.ownershipChangedForm().controls.ownershipChanged?.value === 0
          || this.discountForm()?.controls.discount?.value === 1) && this.discountDetailForm().invalid
        || this.claimForm().invalid
        || (this.claimForm().controls.claim?.value === 1 && this.claimDetailForm().invalid))) {

      this.activeTab.set(this.modelMotorCycleForm().invalid ? 1 : 2);
      this.showError = true;

      setTimeout(() => {
        if (this.exInsurerForm().invalid) {
          this.scrollToElement('ex-insurer');
        }

        if (this.exInsurerDateForm().invalid) {
          this.scrollToElement('ex-insurer-date');
        }

        if (this.discountDetailForm().invalid) {
          this.scrollToElement('discount-detail');
        }

        if (this.claimDetailForm().invalid) {
          this.scrollToElement('claim-detail');
        }
      }, 0);

      return;
    }

    if (!withoutOldInsurance) {
      if (!this.formValidator.claimDetailValidator(this.claimDetailForm())) {
        this.activeTab.set(2);
        setTimeout(() => {
          this.scrollToElement('claim-detail');
        }, 0);
        this.messageService.showErrorMessage('کاربر گرامی، همه گزینه‌ها نمی‌تواند فاقد خسارت باشد.', 'vehicle-message');
        return;
      }

      discount = this.ownershipChangedForm()?.controls.ownershipChanged?.value === 0 ? 1
        : this.discountForm()?.controls.discount?.value;

      claim = this.claimForm()?.controls?.claim?.value;
    }
    const newData: ApplicationFormMotorPutRequestModel = {
      applicationFormId: this.storeService.getFormId(),
      vehicleInfo: {
        buildYear: this.modelMotorCycleForm()?.controls?.buildYear?.value?.toString(),
        typeId: this.modelMotorCycleForm()?.controls?.model?.value,
        vehicleOwnerChanged: (typeof this.ownershipChangedForm()?.controls?.ownershipChanged?.value === 'number')
          ? !!this.ownershipChangedForm()?.controls?.ownershipChanged?.value : null,
        releaseDate: this.exInsurerForm().controls.name?.value === ExtraInsurerForm.NewCar ?
          moment(this.exInsurerForm()?.controls?.releaseDate?.value).format('YYYY/MM/DD') : null
      },
      previousInsuranceDetail: {
        insurerParty: {
          insurerPartyId: withoutOldInsurance ? null : this.exInsurerForm()?.controls?.name?.value,
        },
        startsAt: this.exInsurerDateForm()?.controls?.start?.value,
        endsAt: this.exInsurerDateForm()?.controls?.end?.value,
        driverDiscountId: discount ? this.discountDetailForm()?.controls?.driverDiscount?.value
          : this.constantAllService.driverDiscountDefaultValue(),
        driverDamageId: !withoutOldInsurance ?
          (claim ? this.claimDetailForm()?.controls?.driverDamage?.value : this.constantAllService.driverDamageDefaultValue()) : null,
        healthDamageId: !withoutOldInsurance ?
          (claim ? this.claimDetailForm()?.controls?.healthDamage?.value : this.constantAllService.healthDamageDefaultValue()) : null,
        propertyDamageId: !withoutOldInsurance ?
          (claim ? this.claimDetailForm()?.controls?.propertyDamage?.value
            : this.constantAllService.propertyDamageDefaultValue()) : null,
        thirdPartyDiscountId: discount ? this.discountDetailForm()?.controls?.thirdPartyDiscount?.value
          : this.constantAllService.thirdPartyDiscountDefaultValue()
      }
    };
    if (this.checkChangeValues(newData)) {
      this.modal.close(false);
      return;
    }
    super.addSubscription(this.motorApiService.putApplicationForm(newData).subscribe(
      {
        next: res => {
          res.result.coverageRateId = this.data?.data?.coverageRateId;
          res.result.durationId = this.data?.data?.durationId;
          this.storeService.setStoreData(res.result);
          this.modal.close(true);
        }
      }
    ));
  }

  checkChangeValues(data: ApplicationFormMotorPutRequestModel): boolean {
    const vehicleInfo = this.storeService.getStoreData().vehicleInfo;
    const exInsurer = this.storeService.getStoreData().previousInsuranceDetail;
    return (data.vehicleInfo.buildYear === vehicleInfo.buildYear
      && data.vehicleInfo.typeId === vehicleInfo.typeId
      && data.vehicleInfo.vehicleOwnerChanged === vehicleInfo.vehicleOwnerChanged
      && data.vehicleInfo.releaseDate === vehicleInfo.releaseDate
      && data.previousInsuranceDetail.insurerParty.insurerPartyId === exInsurer.insurerParty.insurerPartyId
      && data.previousInsuranceDetail.startsAt === exInsurer.startsAt
      && data.previousInsuranceDetail.endsAt === exInsurer.endsAt
      && data.previousInsuranceDetail.driverDiscountId === exInsurer.driverDiscount.id
      && data.previousInsuranceDetail.thirdPartyDiscountId === exInsurer.thirdPartyDiscount.id
      && data.previousInsuranceDetail.driverDamageId === exInsurer.driverDamage.id
      && data.previousInsuranceDetail.healthDamageId === exInsurer.healthDamage.id
      && data.previousInsuranceDetail.propertyDamageId === exInsurer.propertyDamage.id);
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }

}
