import { Component, effect, input, model, OnInit, output, signal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';

import { BaseComponent } from '../../../../../../components/base/base.component';
import { PlatePatternChecker } from '../../../../util/plate-pattern-checker';
import { EnterPlateDataModel } from './models/enter-plate-data.model';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'enter-plate',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxSkeletonLoadingComponent,
    NgxPlateComponent
  ],
  templateUrl: './enter-plate.component.html',
  styleUrl: './enter-plate.component.scss'
})
export class EnterPlateComponent extends BaseComponent implements OnInit {
  constructor(private untypedFormBuilder: UntypedFormBuilder) {
    super();
    effect(() => {
      if (this.showError()) {
        if (!this.plate()) {
          this.showPlateError.set(true);
          this.plateError.set('شماره پلاک را وارد کنید');
          return;
        }
        if (!PlatePatternChecker(this.plate())) {
          this.showPlateError.set(true);
          this.plateError.set('شماره پلاک اشتباه است');
          return;
        }
        this.showPlateError.set(false);
      }
    }, {allowSignalWrites: true});
    effect(() => {
      if (this.showError()) {
        if (this.enterPlateForm().invalid) {
          this.enterPlateForm().controls.nationalCode.updateValueAndValidity();
        }
        this.showNationalCodeError.set(true);
      }

      if (this.data().nationalCode === this.enterPlateForm().value.nationalCode) {
        return;
      }
      this.plate.set(this.data().plate);
      this.enterPlateForm().setValue({nationalCode: this.data().nationalCode});

    }, {allowSignalWrites: true});
  }

  data = model<EnterPlateDataModel>();
  showError = input<boolean>(false);
  isValid = output<boolean>();

  enterPlateForm = signal<UntypedFormGroup>(this.untypedFormBuilder.group({
    nationalCode: ['',
      [Validators.required,
        Validators.minLength(10),
        NgxFormValidator.nationalCodeValidator()]
    ]
  }));

  errorMessageMapper: { [key: string]: string } = {
    required: 'بر روی برگ سبز یا کارت خودرو قابل مشاهده است.',
    minlength: 'تعداد ارقام کد ملی  ۱۰ رقم می باشد.',
    invalidNotionalCode: 'کد‌ملی وارد شده معتبر نیست.'
  };

  plate = signal('');
  plateError = signal('');
  showPlateError = signal(false);
  showNationalCodeError = signal(false);

  ngOnInit(): void {
    this.subscribeOnFormChanges();
  }

  handlePlateChange(plate: string): void {
    this.showPlateError.set(false);
  }

  emitOutputs(): void {
    const isValid = this.enterPlateForm().valid && PlatePatternChecker(this.plate());
    this.isValid.emit(isValid);
    this.data.set({
      plate: this.plate(),
      nationalCode: this.enterPlateForm().value.nationalCode
    });
  }

  subscribeOnFormChanges(): void {
    super.addSubscription(this.enterPlateForm().valueChanges
      .subscribe({
        next: (): void => {
          this.emitOutputs();
          this.showNationalCodeError.set(false);
        }
      }));
  }

  handleIsPlateComplete(completedPlate: string): void {
    this.plate.set(completedPlate);
    if (completedPlate) {
      this.showPlateError.set(false);
    }
    this.emitOutputs();
  }
}
