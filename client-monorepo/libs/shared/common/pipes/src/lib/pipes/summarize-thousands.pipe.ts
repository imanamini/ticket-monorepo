import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summarizeThousands',
  standalone: true,
})
export class SummarizeThousandsPipe implements PipeTransform {
  transform(value: number | string): string {
    const numValue = Number(value);

    if (isNaN(numValue) || numValue < 0) {
      return '0';
    }

    if (numValue >= 1000000) {
      let amount = (numValue / 1000000).toFixed(1);
      amount = amount.replace('.0', '');
      return `${amount} میلیون`;
    } else if (numValue >= 10000) {
      let amount = (numValue / 1000).toFixed(1);
      amount = amount.replace('.0', '');
      return `${amount} هزار`;
    } else {
      return numValue.toString();
    }
  }
}
