import { EQUIPMENT_POLICY_STATE_ENUM } from '../../../../policy/data-access/enums/equipment-policy-state.enum';
import { SaleChannelEnum } from '../../../shared-steps/models/sales-channel.enum';

export interface PolicyModel {
  policyId: string;
  policyDraftNo: string;
  policyStatus: Entity;
  policyType: Entity;
  buyer: PersonData;
  policyHolder: PolicyHolder;
  electronicEquipment: ElectronicEquipment;
  providerId: string;
  customerId: string;
  policyAmount: PolicyAmount;
  cancelable: boolean;
  claimable: boolean;
  hasClaim: boolean;
  showRenewalButton: boolean;
  showUsedButton: boolean;
  remainingTimeToUse: number;
  createAt: string;
  endAt: string;
  startAt: string;
  expiresAt: string;
  paidAt: string;
  invoiceUrl: string;
  saleChannel: SaleChannelEnum;
  premiumUrl: string;
  notClaimableReason: string;
  notCancelableReason: string;
  urlKey: string;
  usedKey: string;
}

export interface PersonData {
  address: string;
  zipCode: string;
  birthDate: string;
  email: string;
  firstName: string;
  fullName: string;
  gender: boolean;
  lastName: string;
  mobile: string;
  nationalCode: string;
  province: string;
  city: string;
  userId: string;
  isPlusMember: string;
}

export interface ElectronicEquipment {
  brand: string;
  category: string;
  image: string;
  model: string;
  serialNumber: string;
  VariantId: string;
  price: number;
  priceWithDiscount: number;
  discountCode: string;
  name: string;
}

export interface PolicyAmount {
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  productPrice: number;
  insurerAmount: number;
}

export interface Entity {
  id?: string;
  title?: string;
  identifier?: EQUIPMENT_POLICY_STATE_ENUM;
  value?: any;
  description?: string;
  additionalData?: any;
}

export interface PolicyHolder {
  address: string;
  birthDate: string;
  email: string;
  firstName: string;
  fullName: string;
  gender: boolean;
  lastName: string;
  mobile: string;
  nationalCode: string;
  zipCode: string;
  province: string;
  userId: string;
  city: string;
  isPlusMember: boolean;
}

export interface PolicySortingModel {
  createAtDescending: boolean;
  policyDraftNoDescending: boolean;
}

export interface CancelReasonArgumentModel {
  selectedReasons: [{ identifier: string }];
  policyDraftNo: 0;
  customReason: string;
}
