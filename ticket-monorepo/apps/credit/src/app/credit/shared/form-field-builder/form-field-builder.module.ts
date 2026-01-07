import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './form-field/form-field.component';
import { DgInputComponent } from './field-type/dg-input/dg-input.component';
import { DgSelectComponent } from './field-type/dg-select/dg-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DgSlideToggleComponent } from './field-type/dg-slide-toggle/dg-slide-toggle.component';
import { DgDateComponent } from './field-type/dg-date/dg-date.component';
import { BaseFieldType } from './base-field-type/base-field-type';
import { PersianDatePipe } from './pipes/persion-date.pipe';
import { CalendarDatePickerComponent } from './calendar-date-picker/calendar-date-picker.component';
import { DatePickerBottomSheetComponent } from './date-picker/date-picker-bottom-sheet.component';
import { NumberPickerComponent } from './date-picker/sub-components/number-picker/number-picker.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DgWheelSelectComponent } from './field-type/dg-wheel-select/dg-wheel-select.component';
import { DgAmountComponent } from './field-type/dg-amount/dg-amount.component';
import { NumericKeyboardDirective } from './directives/numeric-keyboard.directive';



@NgModule({
    declarations: [
        FormFieldComponent,
        BaseFieldType,
        DgInputComponent,
        DgSelectComponent,
        DgSlideToggleComponent,
        DgDateComponent,
        PersianDatePipe,
        DatePickerBottomSheetComponent,
        DatePickerComponent,
        CalendarDatePickerComponent,
        NumberPickerComponent,
        DgWheelSelectComponent,
        DgAmountComponent,
        NumericKeyboardDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule
    ],
    exports: [
        FormFieldComponent
    ]
})
export class FormFieldBuilderModule { }
