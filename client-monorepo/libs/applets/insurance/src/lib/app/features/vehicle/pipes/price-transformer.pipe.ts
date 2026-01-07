import { Pipe, PipeTransform } from '@angular/core';
import { numberAmountToWords } from '@digipay/strings';

@Pipe({
  name: 'priceTransformer',
  standalone: true
})
export class PriceTransformerPipe implements PipeTransform {
  transform(value: number | string): string {
    return numberAmountToWords(+value / 10) + ' تومان';
  }
}
