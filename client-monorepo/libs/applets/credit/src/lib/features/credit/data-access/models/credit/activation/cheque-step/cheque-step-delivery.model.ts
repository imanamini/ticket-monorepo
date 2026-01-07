import { ListOption, UserAddress } from '../../profile/credit-profile-response.model';

export enum ChequeStepDeliveryMethod {
  IN_PERSON = 1,
  POST = 2,
  COURIER = 3,
}

export enum ChequeDeliverySteps {
  CHEQUE_DELIVERY_LOCATION,
  CHEQUE_DELIVERY_POST_INFO,
  CHEQUE_DELIVERY_IN_PERSON_ADDRESSES,
  CHEQUE_DELIVERY_LOCATION_TIME_DETAILS,
  CHEQUE_DELIVERY_RESERVED_INFO,
  CHEQUE_DELIVERY_FULL_CAPACITY_ERROR,
}

export interface ChequeDeliveryData {
  deliveryMethod: ChequeStepDeliveryMethod;
  deliveryDate: number;
  fromTime: string;
  toTime: string;
  branchName: string;
  address: string;
}

export interface ProvinceDeliveryMethodModel {
  items: ChequeDeliveryProvince[];
  addresses: UserAddress[];
}

export interface ChequeDeliveryProvince {
  provinceId: number;
  provinceName: string;
  cities: ChequeDeliveryCity[];
}

export interface ChequeDeliveryCity {
  cityId: number;
  cityName: string;
  deliveryMethods: ChequeStepDeliveryMethod[];
}

export interface SelectedAddressModel {
  provinceId: number;
  provinceName: string;
  cityId: number;
  cityName: string;
  address?: string;
  addressNo?: string;
  addressUnit?: string;
  postalCode?: string;
}

export interface BranchAvailabilityScheduleModel {
  items: DeliveryProvider[];
}

export interface CourierAvailabilityScheduleModel {
  items: DeliveryDate[];
}

export interface DeliveryProvider {
  deliveryProviderId: string;
  deliveryProviderName: string;
  deliveryProviderAddress: DeliveryProviderAddress;
  dates: DeliveryDate[];
  listOption?: ListOption;
}

export interface DeliveryProviderAddress {
  fullAddress: string;
  cityName: string;
  streetAddress: string;
  no: string;
  unit: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  phoneNumber: string;
}

export interface DeliveryDate {
  date: number;
  weekDay?: number;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  fromTime?: string;
  toTime?: string;
  title: string;
}

export interface ChequeStepDeliveryReserveInfo {
  pickupAddress?: SelectedAddressModel;
  selectedProvider?: DeliveryProvider;
  selectedDate?: DeliveryDate;
  selectedTime?: TimeSlot;
}

export interface ChequeStepDeliveryReservedDetails {
  title: string;
  badge?: string;
  description?: string;
}

export interface ChequeDeliveryReserveCourierPayload {
  cityId: number;
  streetAddress: string;
  postalCode: string;
  no: string;
  unit: string;
  timeSlotId: number;
  reserveDate: number;
}

export interface ChequeDeliveryReserveInPersonPayload {
  cityId: number;
  deliveryProviderId: string;
  timeSlotId: number;
  reserveDate: number;
}

export const TranslateDeliveryMethod = {
  [ChequeStepDeliveryMethod.POST]: 'پست',
  [ChequeStepDeliveryMethod.IN_PERSON]: 'شعبه حضوری',
  [ChequeStepDeliveryMethod.COURIER]: 'پیک دیجی‌پی',
};
