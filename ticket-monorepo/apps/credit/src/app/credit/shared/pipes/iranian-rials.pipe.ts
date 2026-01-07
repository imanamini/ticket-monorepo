import { Pipe, PipeTransform } from '@angular/core';
import { priceFormat } from '../../../utils/strings';

@Pipe({
  name: 'iranianRials'
})
export class IranianRialsPipe implements PipeTransform {

  transform(value: any, args?: any): string {

    let number = parseInt(value);

    if (isNaN(number) || typeof value === 'undefined' || value === '') {
      return '';
    }

    let options = {
      hideRial: false,
      sep: '٬'
    };

    if (args) {
      // separate options by | character
      args = args.split('|');
      // set hideRial to true if it is present
      // in the array
      if (args.indexOf('hideRial') >= 0) {
        options['hideRial'] = true;
      }
      // make key:value pairs for
      // the passed options
      args.forEach(arg => {
        if (arg.indexOf(':') > 0) {
          // split by colon to separate
          // the keys from the values
          let keyValueSplit = arg.split(':');
          options[keyValueSplit[0]] = keyValueSplit[1];
        }
      });
    }

    let rialText = options.hideRial ? '' : ' ریال';
    return priceFormat(value, options.sep) + rialText;
  }

}
