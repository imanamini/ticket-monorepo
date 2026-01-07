import { USER_ENTRY_POINT } from '../../data-access/models/credit/pre-registration/credit-plan-group';

export interface PreRegistrationFilter {
  creditAmount?: number;
  installmentCount?: number;
  fundProviderCode?: number;
  collateralType?: string;
  registrationFlowType?: string;
  allocationPrepaymentAmount?: number;
  userEntryPoint?: USER_ENTRY_POINT;
}
