import { CompanyDataModel } from './company-data.model';
import { IdTitleModel } from './id-title.model';

export interface InsuranceModel {
  company: CompanyDataModel;
  thirdPartyDiscount?: IdTitleModel;
  driverDiscount?: IdTitleModel;
  propertyDamage?: IdTitleModel;
  healthDamage?: IdTitleModel;
  driverDamage?: IdTitleModel;
  startsAt?: number;
  endsAt?: number;
  insuranceNumber?: string;
  invalid?: boolean;
}
