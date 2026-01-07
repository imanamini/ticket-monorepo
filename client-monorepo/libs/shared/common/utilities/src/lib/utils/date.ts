import moment from 'jalali-moment';

export const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const JALALI_MOMENT = (date: number) => moment(date).locale('fa');

export function getJalaliYear(date: number) {
  return JALALI_MOMENT(date).format('jYYYY');
}

export function getJalaliMonthIndex(date: number) {
  return JALALI_MOMENT(date).format('jM');
}

export function getJalaliMonthTitle(date: number): string {
  const monthNumber = JALALI_MOMENT(date).format('jM');
  return JALALI_MONTHS[+monthNumber - 1] || '';
}

export function getJalaliDay(date: number): string {
  return JALALI_MOMENT(date).format('jD');
}

export function getFullJalaliDate(date: number, separator = ' '): string {
  let day = '1';
  let month = 'فروردین';
  let year = '1400';
  if (date) {
    day = getJalaliDay(date);
    month = getJalaliMonthTitle(date);
    year = getJalaliYear(date);
  }
  return [day, month, year].join(separator);
}

export function isStartAndEndOfMonth(startDate: number, endDate: number): boolean {
  // Formatted start and end of month to ignore time
  const formattedMonthStartDate = JALALI_MOMENT(startDate).startOf('month').format('jYYYY/jM/jD');
  const formattedMonthEndDate = JALALI_MOMENT(startDate).endOf('month').format('jYYYY/jM/jD');

  const formattedStartDate = JALALI_MOMENT(startDate).format('jYYYY/jM/jD');
  const formattedEndDate = JALALI_MOMENT(endDate).format('jYYYY/jM/jD');

  return formattedStartDate === formattedMonthStartDate && formattedEndDate === formattedMonthEndDate;
}

export function formatJalaliDate(date: number, formatStr = 'jYYYY/jMM/jDD'): string {
  return JALALI_MOMENT(date).format(formatStr);
}

export function isExpired(targetDate: number): boolean {
  const now = Date.now();
  return targetDate < now;
}
