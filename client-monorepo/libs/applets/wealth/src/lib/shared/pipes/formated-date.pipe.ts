import { Pipe, PipeTransform } from '@angular/core';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';

@Pipe({
  name: 'formatedDate',
  standalone: true
})
export class FormatedDate implements PipeTransform {

  jalali = new JalaliDatePipe();

  transform(value: string): string {
    let resutl: string;
    const formatedDate = this.jalali.transform(value, false);
    let year = formatedDate.split('/')[0];
    let month = formatedDate.split('/')[1];
    let day = formatedDate.split('/')[2];
    const currentYear = this.jalali.transform(new Date(), false).split('/')[0];

    if (year === currentYear) {
      resutl = `${day} ${this.transformMonth(month)}`;
    } else {
      resutl = `${day} ${this.transformMonth(month)} ${year}`;
    }

    return resutl;
  }

  private transformMonth(month: string): string {
    switch (month) {
      case '1':
        return 'فروردین';
      case '2':
        return 'اردیبهشت';
      case '3':
        return 'خرداد';
      case '4':
        return 'تیر';
      case '5':
        return 'مرداد';
      case '6':
        return 'شهریور';
      case '7':
        return 'مهر';
      case '8':
        return 'آبان';
      case '9':
        return 'آذر';
      case '10':
        return 'دی';
      case '11':
        return 'بهمن';
      case '12':
        return 'اسفند';

      default:
        return month;
    }
  }

}
