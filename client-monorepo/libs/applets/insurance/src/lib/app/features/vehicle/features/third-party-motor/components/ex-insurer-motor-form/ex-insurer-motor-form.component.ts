import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import moment from 'jalali-moment';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';

@Component({
  selector: 'ex-insurer-motor-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
  ],
  templateUrl: './ex-insurer-motor-form.component.html',
  styleUrl: './ex-insurer-motor-form.component.scss'
})
export class ExInsurerMotorFormComponent extends ThirdPartyMotorDirective implements OnInit {

  private dDetector = inject(DeviceDetector);

  exInsurerMotorForm = input.required<FormGroup>();
  showError = model<boolean>(false);
  endDateRange = signal<number>(Date.now() + 32000000000);

  insurers: FormFieldOption[] = [];
  protected readonly extraInsurerForm = ExtraInsurerForm;
  protected readonly Date = Date;

  errorMapper: { [key: string]: string } = {
    required: ''
  };

  showRadioButton = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.setFormControls();
    this.getInsurers();
    this.getNameFromStore();
    this.showRadioButton = !this.dDetector.isDesktop;
  }

  getInsurers(): void {
    super.addSubscription(this.constantAllService.getInsuranceCompanies().subscribe({
      next: res => {
        this.insurers = [
          ...[
            {value: ExtraInsurerForm.NoInsurance, title: 'فاقد بیمه‌نامه'},
            {value: ExtraInsurerForm.NewCar, title: 'صفر کیلومتر'}],
          ...res.map(i => ({value: i.id, title: i.name}))];
      }
    }));
  }

  getNameFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (!!value?.previousInsuranceDetail?.insurerParty?.insurerPartyId) {
          this.exInsurerMotorForm()?.controls.name.setValue(
            value?.previousInsuranceDetail?.insurerParty?.insurerPartyId ?? ExtraInsurerForm.NoInsurance);
        } else if (!!value?.previousInsuranceDetail?.insurerParty?.insurerPartyId === false &&
          !!value?.vehicleInfo?.releaseDate) {
          this.exInsurerMotorForm()?.controls.releaseDate.setValue(moment(value?.vehicleInfo?.releaseDate));
          this.exInsurerMotorForm()?.controls.name.setValue(ExtraInsurerForm.NewCar);
        } else if (!!value?.previousInsuranceDetail?.insurerParty?.insurerPartyId === false &&
          !!value?.vehicleInfo?.releaseDate === false) {
          this.exInsurerMotorForm()?.controls.name.setValue(ExtraInsurerForm.NoInsurance);
        }
      }
    }));
  }

  setFormControls(): void {
    this.exInsurerMotorForm()?.setControl('name', new FormControl(null));
    this.exInsurerMotorForm()?.setControl('releaseDate', new FormControl(null));
    super.addSubscription(this.exInsurerMotorForm()?.controls.name.valueChanges.subscribe({
      next: value => {
        if (value === ExtraInsurerForm.NoInsurance || value === ExtraInsurerForm.NewCar) {
          this.exInsurerMotorForm()?.controls.name.clearValidators();
          if (value === ExtraInsurerForm.NewCar) {
            this.exInsurerMotorForm()?.controls.releaseDate.addValidators([Validators.required]);
          } else {
            this.exInsurerMotorForm()?.controls.releaseDate.setValue(null);
            this.exInsurerMotorForm()?.controls.releaseDate.clearValidators();
          }
        } else {
          this.exInsurerMotorForm()?.controls.releaseDate.setValue(null);
          this.exInsurerMotorForm()?.controls.releaseDate.clearValidators();
          this.exInsurerMotorForm()?.controls.name.setValidators([Validators.required]);
        }
        this.exInsurerMotorForm()?.controls.releaseDate.updateValueAndValidity();
      }
    }));
  }

  protected onNext(route: string): void {
  }

  protected override onClose(): void {
  }
}
