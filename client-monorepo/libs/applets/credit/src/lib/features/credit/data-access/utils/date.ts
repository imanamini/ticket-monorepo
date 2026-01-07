import moment from 'jalali-moment';

const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

export const getMonthTitle = (date: number, withDay = false): string => {
  const monthNUmber = moment(date).locale('fa').format('jM');
  const dayNumber = moment(date).locale('fa').format('jD');

  return withDay ? `${dayNumber} ${months[+monthNUmber - 1]}` : months[+monthNUmber - 1];
};

export const isStartAndEndOfMonth = (startDate: number, endDate: number): boolean => {
  // Formatted start and end of month to ignore time
  const formattedMonthStartDate = moment(startDate).locale('fa').startOf('month').format('jYYYY/jM/jD');
  const formattedMonthEndDate = moment(startDate).locale('fa').endOf('month').format('jYYYY/jM/jD');

  const formattedStartDate = moment(startDate).locale('fa').format('jYYYY/jM/jD');
  const formattedEndDate = moment(endDate).locale('fa').format('jYYYY/jM/jD');

  return formattedStartDate === formattedMonthStartDate && formattedEndDate === formattedMonthEndDate;
};

export const getYear = (date: number) => {
  return moment(date).locale('fa').format('YYYY');
};
