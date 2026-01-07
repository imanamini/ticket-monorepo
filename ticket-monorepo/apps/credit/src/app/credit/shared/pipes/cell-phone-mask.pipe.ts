import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellPhoneMask',
  standalone: true
})
export class CellPhoneMaskPipe implements PipeTransform {

  transform(value: string): string {
    return value.substring(0, 4) + ' **** ' + value.substring(8);
  }

}
