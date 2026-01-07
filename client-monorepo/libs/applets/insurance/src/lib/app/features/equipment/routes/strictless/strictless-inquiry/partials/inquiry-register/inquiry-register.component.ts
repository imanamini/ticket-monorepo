import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'inquiry-register',
  templateUrl: './inquiry-register.component.html',
  styleUrls: ['./inquiry-register.component.scss'],
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UiButtonComponent
  ],
  standalone: true
})
export class InquiryRegisterComponent implements OnInit {

  @Output()
  sendSms = new EventEmitter<any>();

  form: UntypedFormGroup = new UntypedFormGroup({
    mobileNo: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    serialNo: new UntypedFormControl('', [
      Validators.required
    ])
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  inquiry(): void {
    this.sendSms.emit(this.form.value);
  }

}
