export function convertDurationTime(time: number): string {
  let durationAsString = '';
  // tslint:disable-next-line:variable-name
  const number: { [key: number]: string } = {
    1: 'یک',
    2: 'دو',
    3: 'سه',
    4: 'چهار',
    5: 'پنج',
    6: 'شش',
    7: 'هفت',
  };
  const d = getDurationFromMilliseconds(time);
  const day = Math.floor(d.days);
  if (day % 7 === 0 && day >= 7) {
    durationAsString = number[day / 7] + ' هفته';
  } else if (day === 0) {
    durationAsString = 'کمتر از یک روز';
  } else if (day < 7) {
    durationAsString = number[day] + ' روز';
  } else {
    durationAsString = day + ' روز';
  }
  return durationAsString;
}

function getDurationFromMilliseconds(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    milliseconds: milliseconds % 1000,
  };
}
