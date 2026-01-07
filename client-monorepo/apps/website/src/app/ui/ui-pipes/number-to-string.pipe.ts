import { Pipe, PipeTransform } from '@angular/core';
import { priceFormat } from '../ui-components/form-field-builder/utils/strings';

@Pipe({
  name: 'numberToString',
  standalone: true,
})
export class NumberToStringPipe implements PipeTransform {
  transform(input: number, justMainNumber: boolean = false): string {
    const powToStr: { pow: number; label: string }[] = [
      {pow: 9, label: ' میلیارد'},
      {pow: 6, label: ' میلیون'},
      {pow: 3, label: ' هزار'},
    ];

    const tenPow = (pow: number | string): number => {
      return Math.pow(10, +pow);
    };

    const separator = ' و ';

    const specialNumbers: { [key: number]: string } = {
      1: 'یک',
    };

    const tinyNumbers = (input: number): string => {
      if (input <= 0 || input >= 1000) {
        return '';
      }
      if (specialNumbers[input]) {
        return specialNumbers[input];
      }
      return input > 0 ? priceFormat(input) : '';
    };

    const numberToString = (input: number): string => {
      let output = '';
      powToStr.some((item) => {
        if (input >= tenPow(item.pow)) {
          output = numberToString(Math.floor(input / tenPow(item.pow)));
          output += item.label;
          output += input % tenPow(item.pow) ? separator + numberToString(Math.floor(input % tenPow(item.pow))) : '';
          return true;
        }
        return false;
      });
      if (output) {
        return output;
      }
      return tinyNumbers(input);
    };

    if (justMainNumber) {
      powToStr.some(item => {
        if (input >= tenPow(item.pow)) {
          input = Math.floor(input / tenPow(item.pow));
          return true;
        }
        return false;
      });
      return priceFormat(input);
    }

    return numberToString(input);
  }
}
