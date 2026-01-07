import { Pipe, PipeTransform } from '@angular/core';
import moment from 'jalali-moment';

export const DH_FORMAT = 'YYYY/MM/DD  HH:mm';
export const D_FORMAT = 'YYYY/MM/DD';
export const DHMS_FORMAT = 'YYYY/MM/DD  HH:mm:ss';

@Pipe({
  name: 'persianDate',
  standalone: true,
})
export class PersianDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value != null) {
      if (args && args === 'D_H') {
        return moment(value).locale('fa').format(DH_FORMAT);
      }
      if (args && args === 'D_HMS') {
        return moment(value).locale('fa').format(DHMS_FORMAT);
      }
      return moment(value).locale('fa').format(D_FORMAT);
    }
  }
}
