import { CommonModule } from '@angular/common';
import { FormOutputModel } from './model/form-output.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxTouchKeyboardModule } from 'ngx-touch-keyboard';

import { validateNationalId } from '../../../../components/utils/strings';

@Component({
  selector: 'app-national-id',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxTouchKeyboardModule, UiFormFieldBuilderModule],
  templateUrl: './national-id.component.html',
  styleUrl: './national-id.component.scss',
})
export class NationalIdComponent {
  @Input() customeErrorMessage = 'این کد ملی متعلق به شماره موبایل وارد شده نیست';
  @Input() displayTitle = true;
  @Output() formValidation: EventEmitter<FormOutputModel> = new EventEmitter<FormOutputModel>();

  nationalIdForm: FormGroup;
  nationalIdNotMatchError = false;
  nationalIdErrorMessage = 'کد ملی نامعتبر است';

  constructor(private fb: FormBuilder) {
    this.nationalIdForm = this.fb.group({
      nationalId: ['', [Validators.required, this.nationalIdValidator, Validators.minLength(10)]],
    });
  }

  nationalIdChanged() {
    this.nationalIdNotMatchError = false;
    this.formValidation.emit({
      value: this.nationalIdForm.controls['nationalId']?.value,
      isValid: this.nationalIdForm.valid,
    });
  }

  nationalIdValidator(control: AbstractControl): { [s: string]: boolean } {
    if (validateNationalId(control.value)) {
      return null;
    }
    return { invalidNotionalCode: true };
  }
}
