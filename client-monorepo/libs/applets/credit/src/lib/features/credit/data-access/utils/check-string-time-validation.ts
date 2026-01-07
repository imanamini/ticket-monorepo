const timeStringToMinutes = (time: string): number => {
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  return hour * 60 + minute;
};

export const isCurrentTimeBetween = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};
