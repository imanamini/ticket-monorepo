export interface ReturnCourierRequestModel {
  reserveSession: string;
  logisticToken: string;
  cityId: number;
  streetAddress: string;
  postalCode: string;
  no: string;
  unit: string;
  latitude?: number;
  longitude?: number;
  timeSlotId: number;
  reserveDate: Date;
}
