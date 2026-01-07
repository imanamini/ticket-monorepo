import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privateCellNumber'
})
export class PrivateCellNumberPipe implements PipeTransform {

  transform(value: string): any {
    const firstPart = value.slice(0, 4);
    const lastPart = value.slice(9);
    return lastPart + '****' + firstPart;
  }

}
