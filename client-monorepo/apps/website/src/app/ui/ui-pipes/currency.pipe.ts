import { Pipe, PipeTransform } from '@angular/core';
import { currencyFormat } from '@digipay/strings';

@Pipe({
  name: 'IRR',
  standalone: true,
})
export class CurrencyPipe implements PipeTransform {
  transform(value: any, args?: any): string {
    // tslint:disable-next-line:radix
    const n = parseInt(value);

    if (isNaN(n) || typeof value === 'undefined' || value === '') {
      return '';
    }

    return currencyFormat(value);
  }
}
