import moment from 'jalali-moment';

export const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const JALALI_MOMENT = (date: number) => moment(date).locale('fa');

export function getJalaliMonthTitle(date: number): string {
  const monthNumber = JALALI_MOMENT(date);
  return JALALI_MONTHS[+monthNumber - 1] || '';
}
