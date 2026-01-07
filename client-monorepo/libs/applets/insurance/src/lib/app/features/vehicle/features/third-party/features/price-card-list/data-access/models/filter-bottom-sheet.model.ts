import {
  InsuranceCompanyModel
} from '../../../../../../data-access/models/third-party/available-products/insurance-company.model';

export interface FilterBottomSheetModel {
  insuranceCompanies: Partial<InsuranceCompanyModel>[];
  selectedInsuranceCompanies: Partial<InsuranceCompanyModel>[];
}
