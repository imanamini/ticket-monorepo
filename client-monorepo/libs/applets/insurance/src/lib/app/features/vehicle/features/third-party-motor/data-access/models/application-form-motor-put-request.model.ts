export interface VehicleInfo {
  vehicleOwnerChanged?: boolean;
  buildYear?: string;
  typeId?: number;
  releaseDate: string;
}

export interface InsuranceCompany {
  insuranceCompanyId: number;
}

export interface InsurerParty {
  insurerPartyId: string;
}

export interface PreviousInsuranceDetail {
  insuranceCompany?: InsuranceCompany;
  insurerParty?: InsurerParty;
  thirdPartyDiscountId?: number;
  driverDiscountId?: number;
  propertyDamageId?: number;
  healthDamageId?: number;
  driverDamageId?: number;
  startsAt?: number;
  endsAt?: number;
}

export interface ApplicationFormMotorPutRequestModel {
  applicationFormId: string;
  license?: string;
  vehicleInfo?: Partial<VehicleInfo>;
  previousInsuranceDetail?: Partial<PreviousInsuranceDetail>;
}
