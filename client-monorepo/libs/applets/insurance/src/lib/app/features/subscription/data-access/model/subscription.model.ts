import { SubscriptionState } from '../enums/subscription-state.enum';

export interface SubscriptionModel {
  policyId?: string;
  policyNumber?: number;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  productBrand?: string;
  productModel?: string;
  serialNumber?: string;
  pdfUrl?: string;
  nationalCode?: string;
  newPolicyIssuedAt?: string;
  newPolicyExpiredAt?: string;
  isActivated?: boolean;
  currentState: SubscriptionState;
}
