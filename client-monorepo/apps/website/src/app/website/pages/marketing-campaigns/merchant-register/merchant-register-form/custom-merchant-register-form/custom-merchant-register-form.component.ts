import { Component, Input, OnInit } from '@angular/core';
import { ContactForm } from '../../../../../../api/clients/models/templates/contact-us/contact-form';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { ContactClient } from '../../../../../../api/clients/contact-client';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { UiDialogSimpleComponent } from '../../../../../../ui/ui-components/ui-dialogs/ui-dialog-simple/ui-dialog-simple.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgForOf, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-custom-merchant-register-form',
  templateUrl: './custom-merchant-register-form.component.html',
  standalone: true,
  imports: [UiFormFieldBuilderModule, ReactiveFormsModule, UiButtonComponent, NgIf, NgForOf, UiIconDirective],
  styleUrls: ['./custom-merchant-register-form.component.scss'],
})
export class CustomMerchantRegisterFormComponent implements OnInit {
  @Input()
  contactFormDefinition!: ContactForm;

  @Input()
  submitBtn = 'تایید';

  form: UntypedFormGroup;

  focusState: {
    [key: string]: boolean;
  } = {};

  responseMessage = '';

  errors: string[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private contactClient: ContactClient,
    private dialog: DialogBottomSheetService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      solution: [[]],
    });
    this.makeForm();
  }

  hasRequiredValidator(control: AbstractControl): boolean {
    if (control.validator) {
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
      });
    });
  }

  onCheckboxChange(option: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const solutionControl = this.form.get('solution');
    let currentValue = solutionControl.value || [];

    if (isChecked) {
      currentValue.push(option);
    } else {
      currentValue = currentValue.filter((value) => value !== option);
    }
    solutionControl.setValue(currentValue);
  }

  onSubmit() {
    const value = this.form.value;
    const data = {
      title: this.contactFormDefinition.successModalTitle,
      description: this.contactFormDefinition.successModalDescription,
    };
    if (this.form.invalid) {
      return;
    }
    this.errors = [];
    this.responseMessage = '';

    this.contactClient.submitContactForm(this.contactFormDefinition.formId, value).subscribe({
      next: (res) => {
        this.responseMessage = res.info.message;

        this.dialog
          .open(UiDialogSimpleComponent, {
            templateData: data,
          })
          .then();
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
