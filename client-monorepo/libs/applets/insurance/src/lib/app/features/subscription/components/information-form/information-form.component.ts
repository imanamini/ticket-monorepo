import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { JourneyButtonsComponent } from '../../../equipment/partials/journey-buttons/journey-buttons.component';
import { SubscriptionModel } from '../../data-access/model/subscription.model';
import { UsedInfoBoxComponent } from '../../../equipment/routes/used/partials/used-info-box/used-info-box.component';
import { OnlyEnFaArNumbersPattern } from '../../../../util/patterns';
import { NgxFormValidator } from '@digipay/ngx-form-validator';

@Component({
  selector: 'information-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UsedInfoBoxComponent,
    JourneyButtonsComponent
  ],
  templateUrl: './information-form.component.html',
  styleUrl: './information-form.component.scss'
})
export class InformationFormComponent {
  private formBuilder = inject(UntypedFormBuilder);
  form = this.formBuilder.group({
    mobile: ['', [
      Validators.required,
    ]],
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)
    ]],
    productBrand: ['', [
      Validators.required,
    ]],
    productModel: ['', [
      Validators.required,
    ]],
    nationalCode: new UntypedFormControl('', [
      Validators.required,
      NgxFormValidator.nationalCodeValidator(),
    ]),
    serialNumber: ['', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.minLength(15),
      Validators.maxLength(15)
    ]],
  });
  dataRegistered = output<SubscriptionModel>();
  subscriptionInfo = input.required<SubscriptionModel>();

  constructor() {
    effect(() => {
      if (this.subscriptionInfo()) {
        this.setFormData();
      }
    });
  }

  registerInfoSubscription(): void {
    this.dataRegistered.emit(this.form.value);
  }

  setFormData(): void {
    const formData = {
      mobile: this.subscriptionInfo().mobile,
      firstName: this.subscriptionInfo().firstName,
      lastName: this.subscriptionInfo().lastName,
      productBrand: this.subscriptionInfo().productBrand,
      productModel: this.subscriptionInfo().productModel,
      serialNumber: this.subscriptionInfo().serialNumber,
      nationalCode: this.subscriptionInfo().nationalCode,
    };
    this.form.setValue(formData);
  }
}
