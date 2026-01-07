import moment from 'jalali-moment';

export function convertToPersianDate(date: number): string {
  return moment(date)
    .locale('fa')
    .format('YYYY/MM/DD');
}
