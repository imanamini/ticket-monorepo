import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import { DateRangeType, FormFieldInputType, FormFieldType } from '../models/types';
import { FormFieldOption } from '../models/form-field-option.interface';
import { DgDateComponent } from '../field-type/dg-date/dg-date.component';
import { DgSlideToggleComponent } from '../field-type/dg-slide-toggle/dg-slide-toggle.component';
import { DgWheelSelectComponent } from '../field-type/dg-wheel-select/dg-wheel-select.component';
import { DgSelectComponent } from '../field-type/dg-select/dg-select.component';
import { DgAmountComponent } from '../field-type/dg-amount/dg-amount.component';
import { DgInputComponent } from '../field-type/dg-input/dg-input.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [NgIf, DgInputComponent, DgAmountComponent, DgSelectComponent, DgWheelSelectComponent, DgSlideToggleComponent, DgDateComponent],
})
/**
 * FormFieldComponent Component
 * @property {FormFieldType} type Set field type (default: "input")
 * @property {String} label Show top of field
 * @property {String} placeholder Show when field is empty
 * @property {String | Boolean} errorMessage Show bottom of field if it has truly value
 * @property {{[key: string]: string}} errorMessageMapper You can change default error messages
 * @property {ValidationErrors} validation errors of the form control
 * @property {Boolean} readonly User can't edit field if be true
 * @property {Boolean} hasCleaner Show cleaner action for reset field value
 * @property {Boolean} ltrInput Change field direction to ltr if true (default: false)
 * @property {Boolean} ltrPlaceholder Change placeholder direction to ltr if true (default: false)
 * @property {Boolean} multiLine Set true if you need textarea (Only for 'input' type)
 * @property {FormFieldInputType} inputType Set type of input field (Only for 'input' type - default: text)
 * @property {Boolean} multiSelect 'select' fields can be multi selectable if true (Only for 'select' type)
 * @property {{title: string;value?: any;children?: FormFieldOption[];}} options Set 'select' options (Only for 'select' type)
 * @property {DateRangeType} dateRange Set range of date that client can select (Only for 'date category' type)
 * @example
 *    <app-form-field
 *      label="Name"
 *      formControlName="name"
 *      [errorMessage]="Name is required"
 *    ></app-form-field>
 */
export class FormFieldComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() type: FormFieldType = 'input';
  @Input() id: string;
  @Input() label: string;
  @Input() hint: string;
  @Input() placeholder: string;
  @Input() errorMessage: string | boolean;
  @Input() errorMessageMapper: {
    [key: string]: string;
  };
  @Input() error: ValidationErrors;
  @Input() readonly: boolean;
  @Input() hasCleaner = false;
  @Input() ltrInput = false;
  @Input() ltrPlaceholder = false;
  @Input() mandatory = false;
  @Input() tooltipText = '';

  // input type
  @Input() multiLine: boolean;
  @Input() maxSize = 99999;
  @Input() inputType: FormFieldInputType = 'text';

  // select type
  @Input() multiSelect: boolean;
  @Input() options: FormFieldOption[];

  // date type
  @Input() dateRange: DateRangeType;

  value: string;
  form: UntypedFormGroup;
  finalErrorMessage: string;
  defaultErrorMessageMapper: {
    [key: string]: string;
  } = {
    required: 'این فیلد اجباری است',
    pattern: 'عبارت وارد شده نامعتبر است',
    email: 'ورودی باید در قالب ایمیل باشد',
    max: 'عدد ورودی بیشتر از حد مجاز است',
    min: 'عدد ورودی کمتر از حد مجاز است',
    maxlength: 'عبارت وارد شده طولانی است',
    minlength: 'عبارت وارد شده کوتاه است',
  };

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      input: [this.value, [], this.validator.bind(this)],
    });
    this.form.get('input').valueChanges.subscribe((value) => {
      this.propagateChange(value);
      this.propagateTouch();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.error && JSON.stringify(changes.error.currentValue) !== JSON.stringify(changes.error.previousValue) && this.form) {
      this.form.controls.input.updateValueAndValidity({ emitEvent: false });
    }
  }

  propagateChange = (_: any) => {};
  propagateTouch = () => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      this.form.get('input').setValue(obj);
    }
  }

  validator(control: AbstractControl) {
    return new Promise((resolve) => {
      of('')
        .pipe(delay(0))
        .subscribe({
          next: () => {
            const isError = this.updateErrorMessageAndGetErrorStatus();
            resolve(isError ? { error: true } : null);
          },
        });
    });
  }

  private updateErrorMessageAndGetErrorStatus() {
    if (this.errorMessage) {
      this.finalErrorMessage = typeof this.errorMessage === 'string' ? this.errorMessage : null;
      return true;
    }
    if (this.error && Object.keys(this.error) && Object.keys(this.error).length) {
      for (const errorKey in this.error) {
        if (this.error.hasOwnProperty(errorKey) && this.error[errorKey]) {
          this.finalErrorMessage =
            this.errorMessageMapper && this.errorMessageMapper.hasOwnProperty(errorKey)
              ? this.errorMessageMapper[errorKey]
              : this.defaultErrorMessageMapper[errorKey];
          return true;
        }
      }
    }
    this.finalErrorMessage = null;
    return false;
  }
}
