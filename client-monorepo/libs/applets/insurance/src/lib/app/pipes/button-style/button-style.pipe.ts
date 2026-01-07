import { Pipe, PipeTransform } from '@angular/core';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { ButtonStyle } from '@digipay/ngx-button';

@Pipe({
  name: 'buttonStylePipe',
  standalone: true
})
export class ButtonStylePipe implements PipeTransform {
  transform(value: InsButtonStyleEnum): any {
    return value as ButtonStyle;
  }
}
