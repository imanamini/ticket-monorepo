import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import moment from 'jalali-moment';
import { FormFieldOption } from '../models/form-field-option.interface';
import { NumberPickerComponent } from './sub-components/number-picker/number-picker.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf, NumberPickerComponent],
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input()
  value = {
    year: '',
    month: '',
    day: '',
  };

  @Input()
  pickers = {
    year: true,
    month: true,
    day: true,
  };

  @Input()
  allowFuture = false;

  @Output()
  emitClose = new EventEmitter<object>();

  @Input()
  futureYearsOffset = 10;

  emptyInitialize = false;

  lists: {
    year: FormFieldOption[];
    month: FormFieldOption[];
    day: FormFieldOption[];
  } = {
    year: [],
    month: [],
    day: [],
  };

  monthTitle = {
    1: 'فروردین',
    2: 'اردیبهشت',
    3: 'خرداد',
    4: 'تیر',
    5: 'مرداد',
    6: 'شهریور',
    7: 'مهر',
    8: 'آبان',
    9: 'آذر',
    10: 'دی',
    11: 'بهمن',
    12: 'اسفند',
  };

  checkerFunction: any;

  ngOnInit() {
    if (this.value.year === '' && this.emptyInitialize !== true) {
      this.value.year = moment().locale('fa').format('YYYY');
      this.value.month = moment().locale('fa').format('MM');
      this.value.day = moment().locale('fa').format('DD');
    }

    this.makeLists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.futureYearsOffset && changes.futureYearsOffset.currentValue !== changes.futureYearsOffset.previousValue) {
      this.makeLists();
    }
    if (changes.pickers && changes.pickers.currentValue !== changes.pickers.previousValue) {
      this.makeLists();
    }
    if (changes.allowFuture && changes.allowFuture.currentValue !== changes.allowFuture.previousValue) {
      this.makeLists();
    }
  }

  valueChangedCallback() {
    this.makeMonthsList();
    this.makeDaysList();
  }

  isFilled() {
    return this.value.year && this.value.month && ((this.pickers.day && this.value.day) || !this.pickers.day);
  }

  clearButtonClick() {
    this.value = {
      year: '',
      month: '',
      day: '',
    };

    this.emitClose.emit(this.getDismissData());
  }

  confirmClick() {
    this.emitClose.emit(this.getDismissData());
  }

  protected getDismissData() {
    let formatted = '';
    let milliseconds = null;
    let unix = null;
    if (this.isFilled()) {
      formatted = this.value.year + '/' + this.value.month + '/' + (this.pickers.day ? this.value.day : '01');
      milliseconds = moment(formatted, 'jYYYY/jMM/jDD').valueOf();
      unix = moment(formatted, 'jYYYY/jMM/jDD').format('X');
    }

    return {
      formatted,
      milliseconds,
      unix,
    };
  }

  private makeLists() {
    this.makeYearsList();
    this.makeMonthsList();
    this.makeDaysList();
  }

  private makeYearsList() {
    const years = [{ value: '', title: 'سال' }];
    const currentYear = parseInt(moment().locale('fa').format('YYYY'), 10);

    if (this.allowFuture) {
      for (let y = currentYear; y <= currentYear + this.futureYearsOffset; y++) {
        const beginningOfYear = moment(y, 'jYYYY');
        const endOfYear = moment(y + 1, 'jYYYY').subtract(1, 'day');
        if (this.checkWithCallback(beginningOfYear) || this.checkWithCallback(endOfYear)) {
          years.push({
            value: String(y),
            title: String(y),
          });
        }
      }
    } else {
      for (let y = currentYear; y >= 1280; y--) {
        const beginningOfYear = moment(y, 'jYYYY');
        const endOfYear = moment(y + 1, 'jYYYY').subtract(1, 'day');
        if (this.checkWithCallback(beginningOfYear) || this.checkWithCallback(endOfYear)) {
          years.push({
            value: String(y),
            title: String(y),
          });
        }
      }
    }

    this.lists.year = years;
  }

  private makeMonthsList() {
    const months = [
      {
        value: '',
        title: 'ماه',
      },
    ];

    const currentYear = parseInt(moment().locale('fa').format('YYYY'), 10);
    let maxMonth = 12;

    if (this.allowFuture === false && parseInt(this.value.year, 10) === currentYear) {
      maxMonth = parseInt(moment().locale('fa').format('MM'), 10);
    }

    for (let m = 1; m <= maxMonth; m++) {
      /*if (!this.value.year) {
        break;
      }*/
      const beginningOfMonth = moment(this.value.year + '/' + m, 'jYYYY/jMM');
      const endOfMonth = moment(this.value.year + '/' + (m + 1), 'jYYYY/jMM').subtract(1, 'days');
      if (this.checkWithCallback(beginningOfMonth) || this.checkWithCallback(endOfMonth)) {
        months.push({
          value: String(m).padStart(2, '0'),
          title: this.monthTitle[m],
        });
      }
    }

    this.lists.month = months;
  }

  private makeDaysList() {
    const days = [
      {
        value: '',
        title: 'روز',
      },
    ];
    let maxDays = parseInt(this.value.month, 10) <= 6 ? 31 : 30;

    const today = moment();

    if (
      parseInt(today.format('jYYYY'), 10) === parseInt(this.value.year, 10) &&
      parseInt(today.format('jMM'), 10) === parseInt(this.value.month, 10)
    ) {
      maxDays = parseInt(today.format('jDD'), 10);
    }

    for (let m = 1; m <= maxDays; m++) {
      if (!this.value.year || !this.value.month) {
        break;
      }
      const day = moment(this.value.year + '/' + this.value.month + '/' + m, 'jYYYY/jMM/jDD');
      if (this.checkWithCallback(day)) {
        const d = String(m).padStart(2, '0');
        days.push({
          value: d,
          title: d,
        });
      }
    }

    this.lists.day = days;
  }

  /**
   *
   */
  private checkWithCallback(moment: moment.Moment) {
    if (!this.checkerFunction) {
      return true;
    }

    return this.checkerFunction(moment);
  }
}
