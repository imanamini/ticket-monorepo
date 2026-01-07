import { Pipe, PipeTransform } from '@angular/core';
import { numberToString } from './number-to-string';

@Pipe({
  name: 'tomanConvertor'
})
export class TomanConvertorPipe implements PipeTransform {

  transform(rialAmount: string): string {
    let result: string;
    const removedComma: string = rialAmount.replace(/٬/g, '');
    const tomanAmount: number = Number(removedComma.toString().slice(0, -1));
    if (isNaN(tomanAmount)) {
      return 'نامعتبر!';
    }
    if (rialAmount.toString().length < 5) {
      result = `${tomanAmount} تومان`;
      return result;
    }
    result = `${numberToString(tomanAmount)} تومان`;
    return result;
  }

}
