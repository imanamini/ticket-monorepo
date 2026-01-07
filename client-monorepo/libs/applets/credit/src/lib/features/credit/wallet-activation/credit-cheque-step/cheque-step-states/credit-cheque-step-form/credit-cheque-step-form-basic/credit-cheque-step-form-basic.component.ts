import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreditChequeStepInterface } from '../../../services/credit-cheque-step.interface';
import moment from 'jalali-moment';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { CreditScrollableViewComponent } from '../../../../../components/credit-scrollable-view/credit-scrollable-view.component';

@Component({
  selector: 'app-credit-cheque-step-form-basic',
  templateUrl: './credit-cheque-step-form-basic.component.html',
  styleUrls: ['./credit-cheque-step-form-basic.component.scss'],
  imports: [ReactiveFormsModule, NgxButtonComponent, NgxTrackableIdDirective, UiFormFieldBuilderModule, CreditScrollableViewComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepFormBasicComponent implements OnInit {
  initialData = input<CreditChequeStepInterface | null>(null);
  next = output<CreditChequeStepInterface>();

  form!: FormGroup;
  VALIDATION_RULES = {
    chequeNumber: [Validators.required, Validators.pattern(/^\d{16}$/)],
    ownerRelative: [Validators.required],
    ownerNationalCode: [NgxFormValidator.nationalCodeValidator()],
    ownerBirthDate: [this.ownerBirthDateValidator.bind(this)],
    ownerCellNumber: [NgxFormValidator.cellNumberValidator()],
  };
  submitSpinner = signal<boolean>(false);
  today = moment().locale('fa');
  private formBuilder = inject(FormBuilder);

  ngOnInit() {
    this.makeForm(this.initialData());
  }

  makeForm(data: any) {
    this.form = this.formBuilder.group({
      chequeNumber: [data.chequeId, this.VALIDATION_RULES.chequeNumber],
      ownerRelative: ['' + data.ownerRelative || null, this.VALIDATION_RULES.ownerRelative],
      ownerNationalCode: [data.ownerNationalCode || null],
      ownerBirthDate: [data.ownerBirthDate],
      ownerCellNumber: [data.ownerCellNumber],
    });
    this.form.controls['ownerRelative'].valueChanges.subscribe((value) => {
      if (+value) {
        this.form.controls['ownerNationalCode'].setValidators(this.VALIDATION_RULES.ownerNationalCode);
        this.form.controls['ownerBirthDate'].setValidators(this.VALIDATION_RULES.ownerBirthDate);
        this.form.controls['ownerCellNumber'].setValidators(this.VALIDATION_RULES.ownerCellNumber);
        this.form.controls['ownerNationalCode'].updateValueAndValidity();
        this.form.controls['ownerBirthDate'].updateValueAndValidity();
        this.form.controls['ownerCellNumber'].updateValueAndValidity();
      } else {
        this.form.controls['ownerNationalCode'].setValidators([]);
        this.form.controls['ownerBirthDate'].setValidators([]);
        this.form.controls['ownerCellNumber'].setValidators([]);
        this.form.controls['ownerNationalCode'].updateValueAndValidity();
        this.form.controls['ownerBirthDate'].updateValueAndValidity();
        this.form.controls['ownerCellNumber'].updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    this.next.emit({
      chequeId: formValue.chequeNumber,
      ownerRelative: +formValue.ownerRelative,
      ownerNationalCode: +formValue.ownerRelative ? formValue.ownerNationalCode : null,
      ownerBirthDate: +formValue.ownerBirthDate,
      ownerCellNumber: formValue.ownerCellNumber,
    });
  }

  ownerBirthDateValidator(control: AbstractControl): null | ValidationErrors {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    let date = moment(value);
    date = date.locale('fa');
    const diff = this.today.locale('en').diff(date.locale('en'), 'years');
    return diff >= 18 ? null : { invalidBirthDate: true };
  }
}
