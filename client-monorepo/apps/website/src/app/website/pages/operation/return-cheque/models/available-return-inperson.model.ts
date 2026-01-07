export interface AvailableReturnInperson {
  deliveryProviderId: string;
  deliveryProviderName: string;
  deliveryProviderAddress: DeliveryProviderAddress;
  dates: Date[];
}

export interface Date {
  date: string;
  weekDay: WeekDay;
  timeSlots: TimSlot[];
}

export interface TimSlot {
  id: number;
  fromTime: string;
  toTime: string;
  title: string;
}

export interface WeekDay {
  value: number;
  displayName: string;
}

export interface DeliveryProviderAddress {
  cityName: string;
  streetAddress: string;
  no: string;
  unit: string;
  postalCode: string;
  latitude: null;
  longitude: null;
}
