import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

@Component({
  selector: 'get-phone-number',
  templateUrl: './get-phone-number.component.html',
  styleUrls: ['./get-phone-number.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent]
})
export class GetPhoneNumberComponent implements OnInit {

  @Output()
  sendOtpCode = new EventEmitter();

  @Output()
  phoneValueChanged = new EventEmitter();

  form: UntypedFormGroup;

  valueLength = 11;

  constructor() {
  }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      phoneNumber: new UntypedFormControl('', [
          Validators.required,
          Validators.pattern('^(?:09|۰۹)(?:[۰-۹0-9]){9}$'),
          Validators.minLength(this.valueLength),
          Validators.maxLength(this.valueLength)
        ],
      )
    });

    this.form.valueChanges.subscribe(value => {
      if (value?.phoneNumber) {
        const phoneNumber = convertNonEnglishDigits(value.phoneNumber);
        this.phoneValueChanged.emit(phoneNumber);
      }
    });
  }
}
