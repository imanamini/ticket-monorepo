import { AppFormInsuranceCompanyModel } from './app-form-insurance-company.model';

export interface InsuranceDetailModel {
  insurerParty: AppFormInsuranceCompanyModel;
  thirdPartyDiscountId: number;
  driverDiscountId: number;
  propertyDamageId: number;
  healthDamageId: number;
  driverDamageId: number;
  startsAt: number;
  endsAt: number;
  thirdPartyDiscount?: string;
  driverDiscount?: string;
  propertyDamage?: string;
  healthDamage?: string;
  driverDamage?: string;
  insuranceNumber?: string;
}
