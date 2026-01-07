import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postCardShortener',
  standalone: true,
})
export class PostCardShortenerPipe implements PipeTransform {
  transform(value: any, args?: any): string {
    const text = value;

    if (args && text) {
      if ('title' == args) {
        if (text.length > 164) {
          return text.slice(0, 160) + ' ...';
        }
      }

      if ('description' == args) {
        if (text.length > 94) {
          return text.slice(0, 90) + ' ...';
        }
      }
    }

    return text;
  }
}
