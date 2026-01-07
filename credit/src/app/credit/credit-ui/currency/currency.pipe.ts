import { Pipe, PipeTransform } from '@angular/core';
import { priceFormat } from '../../../utils/strings';

@Pipe({
  name: 'FormattedPrice'
})
export class FormattedPricePipe implements PipeTransform {

  transform(value: any, args?: any): string {

    let number = parseInt(value);

    if (isNaN(number) || typeof value === 'undefined' || value === '') {
      return '';
    }

    return priceFormat(value);
  }

}
