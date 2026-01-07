import { Component, Input, OnInit } from '@angular/core';
import { ContactForm } from '../../../../../../api/clients/models/templates/contact-us/contact-form';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ContactClient } from '../../../../../../api/clients/contact-client';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-custom-b2o-form',
  standalone: true,
  templateUrl: './custom-b2o-form.component.html',
  styleUrls: ['./custom-b2o-form.component.scss'],
  imports: [UiFormFieldBuilderModule, FormsModule, UiFormFieldBuilderModule, ReactiveFormsModule, UiButtonComponent],
})
export class CustomB2oFormComponent implements OnInit {
  @Input()
  contactFormDefinition!: ContactForm;

  @Input()
  submitBtn = 'تایید';

  form: UntypedFormGroup;

  focusState: {
    [key: string]: boolean;
  } = {};

  responseMessage = '';
  submited = false;

  errors: string[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private contactClient: ContactClient,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      solution: [[]],
    });
    this.makeForm();
  }

  hasRequiredValidator(control: AbstractControl): boolean {
    if (control?.validator) {
      const validator = control.validator({} as FormControl);
      return !!validator?.required;
    }
    return false;
  }

  private makeForm() {
    this.contactFormDefinition.rows.forEach((row) => {
      row.forEach((field) => {
        const rules = [];
        if (field.mandatory) {
          rules.push(Validators.required);
        }
        if (field.type === 'TAB') {
          const value = field.options[1].value;
          this.form.addControl(field.id, new UntypedFormControl(value, rules));
        } else this.form.addControl(field.id, new UntypedFormControl('', rules));
        if (field.type === 'NATIONAL_ID') {
          rules.push(NgxFormValidator.nationalCodeValidator());
        }
        if (field.type === 'CELL_NUMBER') {
          rules.push(NgxFormValidator.cellNumberValidator());
        }
        if (field.type === 'DROPDOWN') {
          field.options.forEach((option, index) => {
            field.options[index].title = option.label;
          });
        }
      });
    });
  }
  data: any;
  onSubmit() {
    const value = this.form.value;
    this.data = {
      title: this.contactFormDefinition.successModalTitle,
      description: this.contactFormDefinition.successMessage,
    };
    if (this.form.invalid) {
      return;
    }
    this.errors = [];
    this.responseMessage = '';

    this.contactClient.submitContactForm(this.contactFormDefinition.formId, value).subscribe({
      next: (res) => {
        this.responseMessage = res.info.message;
        this.submited = true;
      },
      error: (e) => {
        this.errors = e.error.errors;
        if (e && e.error && e.error.info && e.error.info.message) {
          this.responseMessage = e.error.info.message;
        } else {
          this.responseMessage = 'بروز خطا در هنگام ارسال پیام';
        }
      },
    });
  }
}
