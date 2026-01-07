import { Pipe, PipeTransform } from '@angular/core';
import { currencyFormat } from '@digipay/strings';

@Pipe({
  name: 'rialToToman',
  standalone: true
})
export class RialToTomanPipe implements PipeTransform {
  transform(value: number): string {
    if (value > 10) {
      return (currencyFormat(value / 10) + ' تومان  ');
    } else {
      return ('قیمت باید بین ۱۰٬۰۰۰٬۰۰۰ تا ۱٬7۰۰٬۰۰۰٬۰۰۰ ریال باشد');
    }
  }
}
