import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jalaliTime',
  standalone: true,
})
export class JalaliTimePipe implements PipeTransform {
  transform(value: string, withSeconds = false): string {
    if (!value) return '';
    const d = new Date(value);
    const [hour, min, sec] = [d.getHours(), d.getMinutes(), d.getSeconds()];
    return `${hour < 10 ? `0${hour}` : `${hour}`}:${min < 10 ? `0${min}` : `${min}`
    }${withSeconds ? `:${sec}` : ''}`;
  }
}
