import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedCellNumber'
})
export class FormattedCellNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.replace(/^(\d{4})(\d{3})(\d{4})$/ig, '$1 $2 $3');
    }

    return null;
  }

}
