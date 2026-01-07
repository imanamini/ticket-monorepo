export interface VehicleInfo {
  vehicleOwnerChanged?: any;
  buildYear: string;
  typeId: number;
  type: string;
  releaseDate?: any;
}

export interface InsurerParty {
  insurerPartyId?: any;
  insurerPartyName?: any;
  insurerPartyLogo?: any;
}

export interface PreviousInsuranceDetail {
  insurerParty: InsurerParty;
  thirdPartyDiscountId?: any;
  thirdPartyDiscount?: any;
  driverDiscountId?: any;
  driverDiscount?: any;
  propertyDamageId?: any;
  propertyDamage?: any;
  healthDamageId?: any;
  healthDamage?: any;
  driverDamageId?: any;
  driverDamage?: any;
  startsAt?: any;
  endsAt?: any;
  insuranceNumber?: any;
}

export interface CurrentInsurerParty {
  insurerPartyId?: any;
  insurerPartyName?: any;
  insurerPartyLogo?: any;
}

export interface ApplicationFormMotorModel {
  applicationFormId: string;
  license?: any;
  trackingCode?: any;
  vehicleInfo: VehicleInfo;
  previousInsuranceDetail: PreviousInsuranceDetail;
  currentInsurerParty: CurrentInsurerParty;
  nationalCode?: any;
  address?: any;
  insuredParty?: any;
  requesterParty?: any;
  durationId?: any;
  duration?: any;
  coverageRateId?: any;
  coverageRate?: any;
  priceOptions?: any;
  price?: any;
  documents?: any;
  requiredDocuments?: any;
  journeyType: number;
  state?: any;
}
