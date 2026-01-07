import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { UiContactSectionComponent } from './ui-contact-section/ui-contact-section.component';

import { ReactiveFormsModule } from '@angular/forms';
import { UiDatePickerModule } from '../ui-date-picker/ui-date-picker.module';

import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

@NgModule({
  exports: [ContactFormComponent, UiContactSectionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiDatePickerModule,
    UiFormFieldBuilderModule,
    ContactFormComponent,
    UiContactSectionComponent,
  ],
})
export class UiContactModule {}
