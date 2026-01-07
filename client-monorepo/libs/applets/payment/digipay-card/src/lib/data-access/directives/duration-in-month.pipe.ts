import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationInMonth',
  standalone: true,
})
export class DurationInMonthPipe implements PipeTransform {
  transform(value: number): string {
    const units = [
      '',
      'یک',
      'دو',
      'سه',
      'چهار',
      'پنج',
      'شش',
      'هفت',
      'هشت',
      'نه',
      'ده',
      'یازده',
      'دوازده',
      'سیزده',
      'چهارده',
      'پانزده',
      'شانزده',
      'هفده',
      'هجده',
      'نونزده',
    ];
    const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];

    if (1 <= value && value < 20) {
      return units[value] + ' ماهه';
    } else if (20 <= value && value <= 99) {
      return tens[Math.floor(value / 10)] + ' و ' + units[value % 10] + ' ماهه';
    } else {
      return 'Number out of range';
    }
  }
}
