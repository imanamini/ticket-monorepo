import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditPersianDate',
  standalone: true,
})
export class CreditPersianDatePipe implements PipeTransform {
  transform(value: number | string | Date, type: 'weekday' | 'month' | 'year' | 'day'): string {
    if (!value) return '';

    let date: Date;

    if (typeof value === 'number') {
      date = new Date(value);
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {
      calendar: 'persian',
    };

    switch (type) {
      case 'weekday':
        options.weekday = 'long';
        break;
      case 'month':
        options.month = 'long';
        break;
      case 'year':
        options.year = 'numeric';
        break;
      case 'day':
        options.day = 'numeric';
        break;
    }

    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', options).format(date);
  }
}
