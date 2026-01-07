import { Pipe, PipeTransform } from '@angular/core';
import { priceFormat } from '../../../utils/strings';

@Pipe({
  name: 'IRR'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): string {

    // tslint:disable-next-line:radix
    const n = parseInt(value);

    if (isNaN(n) || typeof value === 'undefined' || value === '') {
      return '';
    }

    return priceFormat(value);
  }

}
