import { Pipe, PipeTransform } from '@angular/core';
import { currencyFormat } from '@digipay/strings';

@Pipe({
  name: 'creditNumberToString',
  standalone: true,
})
export class CreditNumberToStringPipe implements PipeTransform {
  transform(input: number, justMainNumber = false): string {
    const powToStr: { pow: number; label: string }[] = [
      { pow: 9, label: ' میلیارد' },
      { pow: 6, label: ' میلیون' },
      { pow: 3, label: ' هزار' },
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
      return input > 0 ? currencyFormat(input) : '';
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
      // Return the main number without any formatting or labels
      powToStr.some((item) => {
        if (input >= tenPow(item.pow)) {
          input = Math.floor(input / tenPow(item.pow));
          return true;
        }
        return false;
      });
      return currencyFormat(input);
    }

    return numberToString(input);
  }
}
