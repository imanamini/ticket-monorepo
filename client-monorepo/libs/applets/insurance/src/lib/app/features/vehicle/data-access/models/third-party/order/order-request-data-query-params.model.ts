export interface OrderRequestDataQueryParamsModel {
  carModelId: number;
  carUsageId: number;
  carTypeId: number;
  carBrandId: number;
  thirdPartyDiscountId: number;
  driverDiscountId: number;
  durationId: number;
  coverageRateId: number;
  propertyDamageId: number;
  healthDamageId: number;
  driverDamageId: number;
  buildYear: string;
  currentInsuranceId: number;
  currentInsuranceDeadline: number;
  currentInsuranceIssuanceDate: number;
  vehicleOwnerChanged?: boolean;
  license?: string;
  nationalCode?: string;
  isSan?: boolean;
}
