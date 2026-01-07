import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
  name: 'persianDatePipe'
})
export class PersianDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let format = 'jYYYY/jM/jD';

    if (args) {
      format = args;
    }

    if (value) {
      return moment(value).format(format);
    }

    return null;
  }

}
