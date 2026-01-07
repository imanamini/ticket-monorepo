export interface AvailableReturnCourier {
  dateTime: string;
  weekDay: WeekDay;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  fromTime: string;
  toTime: string;
  title: string;
}

export interface WeekDay {
  value: number;
  displayName: string;
}
