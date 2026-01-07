import { Component, Inject, ViewEncapsulation } from '@angular/core';
import moment from 'moment-jalaali';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DatePickerComponent } from './date-picker.component';
import { NumberPickerComponent } from './sub-components/number-picker/number-picker.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'date-picker-bottom-sheet',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf, NumberPickerComponent],
})
export class DatePickerBottomSheetComponent extends DatePickerComponent {
  futureYearsOffset = 20;

  emptyInitialize = true;

  constructor(
    private _ref: MatBottomSheetRef<DatePickerBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {
    super();

    if (data.value) {
      const date = moment(data.value);
      this.value = {
        year: date.format('jYYYY'),
        month: date.format('jMM'),
        day: date.format('jDD'),
      };
    } else {
      this.value = {
        year: '',
        month: '',
        day: '',
      };
    }

    if (data.pickers) {
      this.pickers = data.pickers;
    }

    if (data.hasOwnProperty('allowFuture')) {
      this.allowFuture = data.allowFuture;
    }
    if (data.checker) {
      this.checkerFunction = data.checker;
    }
  }

  clearButtonClick() {
    this.value = {
      year: '',
      month: '',
      day: '',
    };

    this._ref.dismiss(this.getDismissData());
  }

  confirmClick() {
    this._ref.dismiss(this.getDismissData());
  }
}
