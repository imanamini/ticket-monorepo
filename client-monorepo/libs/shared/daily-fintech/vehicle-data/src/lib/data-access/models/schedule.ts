export enum ScheduleAction {
  NOTIFICATION = 0,
  AUTO_PAY = 1,
}

export enum ScheduleTarget {
  TOP_UP = 0,
  TOLL = 1,
}

export enum SchedulePeriodType {
  ONE_TIME,
  DAILY,
  EVERY_OTHER_DAY,
  WEEKLY,
  MONTHLY,
  YEARLY,
  HOURLY,
  EVERY_FOUR_HOUR,
  EVERY_TWO_HOUR
}
