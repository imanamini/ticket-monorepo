import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-jalaali';

@Pipe({
  name: 'jalaliDate'
})
export class JalaliDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let format = 'jYYYY/jM/jD';

    if(args){
      format = args;
    }

    if (value) {
      return moment(value).format(format);
    }

    return null;
  }

}
