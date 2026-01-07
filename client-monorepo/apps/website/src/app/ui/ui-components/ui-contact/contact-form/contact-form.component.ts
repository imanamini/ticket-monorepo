import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';

import { ContactForm, ContactFormField } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactClient } from '../../../../api/clients/contact-client';
import moment from 'jalali-moment';
import { UiDialogSimpleComponent } from '../../ui-dialogs/ui-dialog-simple/ui-dialog-simple.component';
import { UiDialogContentPromotionComponent } from '../../ui-dialogs/ui-dialog-content-promotion/ui-dialog-content-promotion.component';
import { FormModal } from '../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { UiDialogWorkingCapitalComponent } from '../../ui-dialogs/ui-dialog-working-capital/ui-dialog-working-capital.component';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { CalendarDatePickerComponent } from '../../ui-date-picker/calendar-date-picker/calendar-date-picker.component';
import { FormFieldComponent } from '../../form-field-builder/form-field/form-field.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgFor, NgSwitch, NgSwitchCase, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    NgClass,
    UiFormFieldBuilderModule,
    FormFieldComponent,
    NgIf,
    CalendarDatePickerComponent,
    UiButtonComponent,
  ],
})
export class ContactFormComponent implements OnInit, OnChanges {
  @Input() contactFormDefinition!: ContactForm;

  @Input() modalType: 'simple' | 'content-promotion' | 'working-capital' = 'simple';

  @Input() modal: FormModal;

  form: UntypedFormGroup;

  focusState: {
    [key: string]: boolean;
  } = {};

  showDatePicker: {
    [key: string]: boolean;
  } = {};

  datePickersTimestamp: {
    [key: string]: any;
  } = {};

  submitting = false;

  responseMessage = '';

  errors: string[] = [];
  mapContactForm: Map<string, ContactFormField> = new Map();

  @Input() submitBtn = 'ثبت درخواست';

  @Output() closeDialogButton: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(PLATFORM_ID) public platformId: string,
    private contactClient: ContactClient,
    private dialog: DialogBottomSheetService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.contactFormDefinition.rows.sort((a, b) => a[0].rowNumber - b[0].rowNumber);
    this.contactFormDefinition.rows.forEach((row) => {
      row.forEach((field) => {
        this.mapContactForm.set(field.id, field);
        if (field.type === 'DROPDOWN') {
          field.options = field.options.map((item) => {
            return {
              title: item.label,
              value: item.value,
              label: item.label,
            };
          });
        }
      });
    });
  }

  createForm() {
    this.form = this.formBuilder.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactFormDefinition'].currentValue) {
      this.makeForm();
    }
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
    this.submitting = true;

    this.errors = [];
    this.responseMessage = '';

    this.contactClient.submitContactForm(this.contactFormDefinition.formId, value).subscribe({
      next: (res) => {
        this.submitting = false;
        this.responseMessage = res.info.message;
        if (data.title && data.description && this.modalType === 'working-capital') {
          this.dialog
            .open(UiDialogWorkingCapitalComponent, {
              templateData: data,
            })
            .then((showDocuments) => {
              this.closeDialogButton.emit({
                formValue: this.form.value,
                showDocuments: showDocuments,
              });
              this.clearForm();
            });
        } else if (data.title && data.description && this.modalType === 'simple') {
          this.dialog
            .open(UiDialogSimpleComponent, {
              templateData: data,
            })
            .then(() => {
              this.closeDialogButton.emit();
              this.clearForm();
            });
        } else if (data.title && data.description && this.modalType === 'content-promotion') {
          this.dialog.open(UiDialogContentPromotionComponent, {
            width: this.modal.modalBannerDesktop ? '768px' : '512px',
            height: '360px',
            titleIcon: 'icon-check-big-green',
            templateData: data,
            promotionServices: this.modal.promotionServices,
            modalBannerDesktop: this.modal.modalBannerDesktop,
            modalBannerMobile: this.modal.modalBannerMobile,
            bannerLink: this.modal.bannerLink,
          });
          this.clearForm();
        }
      },
      error: (e) => {
        this.submitting = false;
        this.errors = e.error.errors;
        if (e && e.error && e.error.info && e.error.info.message) {
          this.responseMessage = e.error.info.message;
        } else {
          this.responseMessage = 'بروز خطا در هنگام ارسال پیام';
        }
      },
    });
  }

  onDatePick(id: string, event: any) {
    this.showDatePicker[id] = false;
    const date = moment(event).format('jYYYY/jMM/jDD');
    this.datePickersTimestamp[id] = moment(event).valueOf();
    this.form.patchValue({
      [id]: date,
    });
  }

  markFormGroupUntouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      control.setErrors(null);
      control.reset(null);
      control.updateValueAndValidity();

      if (control instanceof FormGroup) {
        this.markFormGroupUntouched(control); // For nested form groups
      }
    });
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

  private clearForm() {
    const TABS = [];
    this.contactFormDefinition.rows.forEach((row) => {
      row.forEach((field) => {
        const tab: any = {};
        if (field.type === 'TAB') {
          tab.id = field.id;
          tab.value = field.options[0].value;
          TABS.push(tab);
        }
      });
    });
    const clearForm: any = {};
    Object.keys(this.form.value).forEach((key) => {
      clearForm[key] = '';
      TABS.forEach((tab) => {
        if (tab.id === key) {
          clearForm[key] = tab.value;
        }
      });
    });
    this.form.patchValue(clearForm);
    this.submitBtn = 'ثبت درخواست جدید';
  }
}
