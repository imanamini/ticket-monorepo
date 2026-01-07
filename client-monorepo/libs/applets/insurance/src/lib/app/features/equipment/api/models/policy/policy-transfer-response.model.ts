import { ElectronicEquipment, Entity, PersonData, PolicyHolder } from './policy.model';

export interface PolicyTransferResponseModel {
  isOwner: boolean;
  hasProfile: boolean;
  policy: TransferPolicyShortenModel;
}

export interface TransferPolicyShortenModel {
  buyer: PersonData;
  electronicEquipment: ElectronicEquipment;
  policyHolder: PolicyHolder;
  policyStatus: Entity;
  policyType: Entity;
  policyId: string;
  policyDraftNo: number;
  saleChannel: string;
  issuedAt: number;
  startAt: number;
  endAt: number;
  currentState: number;
  transferMobile: string;
  transferCode: string;
  transferExpiresAt: string;
}
