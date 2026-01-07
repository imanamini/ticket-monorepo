export interface RenewalModel {
  orderId: string;
  oldPolicyNumber: string;
  policyNumber: number | null;
  policyIssuedAt: string | null;
  expiresAt: string;
  uniqueCode: string;
  firstName: string;
  lastName: string;
  mobile: string;
  nationalCode: null | string;
  productCategory: string;
  productBrand: string;
  productModel: string;
  serialNumber: null | string;
  hasClaim?: boolean;
  currentState: number;
  daysLeft: number;
  fullName: string;
  expiresAtPersian: string;
  link?: string;
}
