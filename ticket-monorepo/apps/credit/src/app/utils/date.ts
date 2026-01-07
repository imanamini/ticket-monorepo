import moment from 'jalali-moment';

const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const getMonthTitle = (date: number, withDay: boolean = false): string => {
  const monthNUmber = moment(date).locale('fa').format('jM');
  const dayNumber = moment(date).locale('fa').format('jD');

  return withDay ? `${dayNumber} ${months[+monthNUmber - 1]}` : months[+monthNUmber - 1];
};

export const getYear = (date: number) => {
  return moment(date).locale('fa').format('YYYY');
};
