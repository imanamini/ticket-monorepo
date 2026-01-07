import { ReserveStatus } from './reserve-status.enum';

export interface VerifyOtpResponseModel {
  customer: Customer;
  reserve: Reserve;
  collateralCount: number;
  direction: Method;
  reserveSession: string;
  reserveStatus: ReserveStatus;
}

export interface Reserve {
  method: Method;
  city: City;
  province: Province;
  deliveryProvider?: any;
  address: Address;
  reserveDate?: any;
  reserveStatus: Method;
  timeSlot?: any;
}

export interface Address {
  cityName: string;
  streetAddress: string;
  no: string;
  unit: string;
  postalCode: string;
  latitude?: any;
  longitude?: any;
}

export interface Province {
  name: string;
  cities?: any;
  id: Id;
}

export interface City {
  id: Id;
  name: string;
}

export interface Id {
  value: number;
}

export interface Method {
  value: number;
  displayName: string;
}

export interface Customer {
  fullName: string;
  mobileNumber: string;
}
