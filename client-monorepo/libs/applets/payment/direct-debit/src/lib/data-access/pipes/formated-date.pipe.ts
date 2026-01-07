import { Pipe, PipeTransform } from '@angular/core';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';

@Pipe({
  name: 'formattedDate',
  standalone: true,
})
export class FormatedDate implements PipeTransform {
  jalali = new JalaliDatePipe();

  transform(value: string): string {
    const result = value.split('/');
    result[1] = `${this.transformMonth(+result[1])}`;
    return result.reverse().join(' ');
  }

  private transformMonth(month: number): number | string {
    switch (month) {
      case 1:
        return 'فروردین';
      case 2:
        return 'اردیبهشت';
      case 3:
        return 'خرداد';
      case 4:
        return 'تیر';
      case 5:
        return 'مرداد';
      case 6:
        return 'شهریور';
      case 7:
        return 'مهر';
      case 8:
        return 'آبان';
      case 9:
        return 'آذر';
      case 10:
        return 'دی';
      case 11:
        return 'بهمن';
      case 12:
        return 'اسفند';

      default:
        return month;
    }
  }
}
