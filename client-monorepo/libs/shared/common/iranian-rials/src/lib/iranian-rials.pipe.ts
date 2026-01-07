import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iranianRials',
  standalone: true,
})
export class IranianRialsPipe implements PipeTransform {
  transform(value: any): string {
    const number = parseInt(value);

    if (isNaN(number) || typeof value === 'undefined' || value === '') {
      return '';
    }

    const rialText = ' ریال';
    return this.priceFormat(value) + rialText;
  }

  private priceFormat(numberToFormat: any, separator = '٬', removeLeadingZeros = false) {
    if (typeof numberToFormat !== 'string') {
      numberToFormat = parseInt(numberToFormat, 10);
    }
    if (numberToFormat !== '' && removeLeadingZeros) {
      numberToFormat = parseInt(String(numberToFormat).replace(/^0*/, ''), 10);
    }
    return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
}
