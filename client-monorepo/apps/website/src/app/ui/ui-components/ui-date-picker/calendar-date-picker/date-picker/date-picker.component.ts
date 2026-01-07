import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import moment from 'jalali-moment';
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
  close = new EventEmitter<object>();

  @Input()
  futureYearsOffset = 10;

  emptyInitialize = false;

  lists = {
    year: [],
    month: [],
    day: [],
  };

  checkerFunction!: Function;

  ngOnInit() {
    if (this.value.year === '' && this.emptyInitialize !== true) {
      this.value.year = moment().locale('fa').format('YYYY');
      this.value.month = moment().locale('fa').format('MM');
      this.value.day = moment().locale('fa').format('DD');
    }

    this.makeLists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    if (changes.futureYearsOffset && changes.futureYearsOffset.currentValue !== changes.futureYearsOffset.previousValue) {
      this.makeLists();
    }
    // @ts-ignore
    if (changes.pickers && changes.pickers.currentValue !== changes.pickers.previousValue) {
      this.makeLists();
    }
    // @ts-ignore
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

    this.close.emit(this.getDismissData());
  }

  confirmClick() {
    this.close.emit(this.getDismissData());
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
    const years = [{ value: '', label: 'سال' }];
    const currentYear = parseInt(moment().locale('fa').format('YYYY'));

    if (this.allowFuture) {
      for (let y = currentYear; y <= currentYear + this.futureYearsOffset; y++) {
        const year = moment(y, 'jYYYY');
        if (this.checkWithCallback(year)) {
          years.push({
            value: String(y),
            label: String(y),
          });
        }
      }
    } else {
      for (let y = currentYear; y >= 1280; y--) {
        const year = moment(y, 'jYYYY');
        if (this.checkWithCallback(year)) {
          years.push({
            value: String(y),
            label: String(y),
          });
        }
      }
    }

    // @ts-ignore
    this.lists.year = years;
  }

  private makeMonthsList() {
    const months = [
      {
        value: '',
        label: 'ماه',
      },
    ];

    const currentYear = parseInt(moment().locale('fa').format('YYYY'));
    let maxMonth = 12;

    if (this.allowFuture === false && parseInt(this.value.year) == currentYear) {
      maxMonth = parseInt(moment().locale('fa').format('MM'));
    }

    for (let m = 1; m <= maxMonth; m++) {
      if (!this.value.year) {
        break;
      }
      const month = moment(this.value.year + '/' + m, 'jYYYY/jMM');
      if (this.checkWithCallback(month)) {
        months.push({
          value: String(m).padStart(2, '0'),
          label: String(m).padStart(2, '0'),
        });
      }
    }

    // @ts-ignore
    this.lists.month = months;
  }

  private makeDaysList() {
    const days = [
      {
        value: '',
        label: 'روز',
      },
    ];
    let maxDays = parseInt(this.value.month) <= 6 ? 31 : 30;

    const today = moment();

    if (parseInt(today.format('jYYYY')) === parseInt(this.value.year) && parseInt(today.format('jMM')) === parseInt(this.value.month)) {
      maxDays = parseInt(today.format('jDD'));
    }

    for (let m = 1; m <= maxDays; m++) {
      if (!this.value.year || !this.value.month) {
        break;
      }
      const day = moment(this.value.year + '/' + this.value.month + '/' + m, 'jYYYY/jMM/jDD');
      if (this.checkWithCallback(day)) {
        const d = String(m).padStart(2, '0');
        days.push({
          label: d,
          value: d,
        });
      }
    }

    // @ts-ignore
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
