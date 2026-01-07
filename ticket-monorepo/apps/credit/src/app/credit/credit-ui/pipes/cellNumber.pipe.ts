import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellNumber'
})
export class CellNumberPipe implements PipeTransform {

  transform(value: any, args?: any): string {

    if (typeof value !== 'string') {
      value = String(value);
    }

    return value.replace(/^(\d{4})(\d{3})(\d{4})$/ig, '$1 $2 $3');
  }

}
