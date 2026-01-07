import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { convertEnglishDigitsToPersian } from '@digipay/strings';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-bank-card-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './mobile-date-picker.component.html',
  styleUrls: ['./mobile-date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileDatePickerComponent implements OnInit, OnChanges {
  @Output()
  confirm = new EventEmitter<{ timestamp: number; date: string }>();

  @Output()
  hide = new EventEmitter();

  year = '';

  month = '';

  @Input()
  date = '';

  dateTs: number | null = null;

  @Input()
  yearOptions: FormFieldOption[] = [];

  @Input()
  monthOptions: FormFieldOption[] = [];

  constructor(private datePipe: JalaliDatePipe) {}

  ngOnInit() {
    this.setYears();
    this.setMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && changes['date'].currentValue) {
      this.parseDate();
    }
  }

  confirmDateSelection() {
    if (!this.year || !this.month) {
      return;
    }

    const exDate = this.year + '/' + this.month;
    const date = exDate + '/' + '01';

    this.dateTs = +this.datePipe.transform(date, 'X');
    this.date = date;

    this.confirm.emit({
      date: exDate,
      timestamp: this.dateTs,
    });
  }

  hideDatePicker() {
    this.hide.emit();
  }

  private parseDate() {
    if (this.date && this.date.indexOf('/') > 0) {
      const dateParts = this.date.split('/');
      this.year = dateParts[0];
      this.month = dateParts[1];
      const fullDate = this.year + '/' + this.month + '/01';
      this.dateTs = this.datePipe.transform(fullDate, 'X');
    }
  }

  private setYears() {
    this.yearOptions = [
      {
        value: '',
        title: 'سال',
      },
    ];
    const thisYear = +this.datePipe.transform(new Date(), 'jYYYY');
    for (let i = thisYear; i <= thisYear + 10; i++) {
      const y = '' + i;
      this.yearOptions.push({ title: convertEnglishDigitsToPersian(y), value: y });
    }
  }

  private setMonths() {
    this.monthOptions = [
      {
        value: '',
        title: 'ماه',
      },
    ];
    for (let i = 1; i <= 12; i++) {
      const m = i < 10 ? '0' + i : '' + i;
      this.monthOptions.push({ title: convertEnglishDigitsToPersian(m), value: m });
    }
  }
}
