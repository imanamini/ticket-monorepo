import { Component, Input } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import moment from 'jalali-moment';
import { DateRangeType } from '../../models/types';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DatePickerBottomSheetComponent } from '../../date-picker/date-picker-bottom-sheet.component';
import { DatePickerResultModel } from '../../date-picker/date-picker-result.model';
import { DeviceService } from '../../../../../core/services/device/device.service';
import { PersianDatePipe } from '../../pipes/persion-date.pipe';
import { CalendarDatePickerComponent } from '../../calendar-date-picker/calendar-date-picker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-dg-date',
  templateUrl: './dg-date.component.html',
  styleUrls: ['./dg-date.component.scss', '../dg-input/dg-input.component.scss'],
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgIf, CalendarDatePickerComponent, PersianDatePipe],
})
export class DgDateComponent extends BaseFieldType {
  visibleDatePicker: boolean;
  initialCalendarView: 'days' | 'years' | 'months' = 'years';
  @Input() showTime = false;
  @Input() endPicker = true;
  @Input() dateRange: DateRangeType = 'all';
  isFocused: boolean;

  constructor(
    private bottomSheet: MatBottomSheet,
    private deviceService: DeviceService,
  ) {
    super();
  }

  setDate(evt: moment.Moment) {
    this.visibleDatePicker = false;
    const value = moment(evt).valueOf();
    this.form.controls[this.formControlName].setValue(value);
    this.form.controls[this.formControlName].markAsTouched();
  }

  toggleDatePicker(): void {
    if (this.deviceService.supportsTouch()) {
      this.bottomSheet
        .open(DatePickerBottomSheetComponent, {
          panelClass: 'date-picker-bottom-sheet',
          data: {
            value: this.form.controls[this.formControlName].value ? this.form.controls[this.formControlName].value : '',
          },
        })
        .afterDismissed()
        .subscribe((data) => {
          const result = data as DatePickerResultModel;
          if (!result) {
            return;
          }
          this.form.controls[this.formControlName].setValue(result.milliseconds || null);
          this.form.controls[this.formControlName].markAsTouched();
        });
    } else {
      this.visibleDatePicker = !this.visibleDatePicker;
    }
  }
}
