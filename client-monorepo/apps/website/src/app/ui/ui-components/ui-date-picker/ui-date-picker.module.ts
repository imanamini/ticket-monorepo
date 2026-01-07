import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarDatePickerComponent } from './calendar-date-picker/calendar-date-picker.component';
import { DatePickerComponent } from './calendar-date-picker/date-picker/date-picker.component';
import { NumberPickerComponent } from './calendar-date-picker/date-picker/sub-components/number-picker/number-picker.component';
import { FormsModule } from '@angular/forms';
import { DatePickerBottomSheetComponent } from './calendar-date-picker/date-picker/date-picker-bottom-sheet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarDatePickerComponent,
    DatePickerComponent,
    NumberPickerComponent,
    DatePickerBottomSheetComponent,
  ],
  exports: [CalendarDatePickerComponent, DatePickerBottomSheetComponent],
})
export class UiDatePickerModule {}
