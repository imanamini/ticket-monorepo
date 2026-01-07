import { DamageDocuments } from '../damages/damages.model';
import { Entity, PersonData } from '../policy/policy.model';

export interface ClaimModel {
  claimCaseNo: number;
  policyDraftNo: number;
  story: string;
  accidentAt: number;
  requestedAt: string;
  lastChangedAt: string;
  paidAt: string;
  selectedCover: Entity;
  claimStatus: ClaimStatus;
  payableAmount: number;
  isActiveClaim: boolean;
  requestedBy: PersonData;
  activeExpert: PersonData;
  expertDescription: string;
}

export interface AddClaimModel {
  policyDraftNo: number;
  accidentAt: string;
  story: string;
  selectedCoverIdentifier: string;
  documents: DamageDocuments[];
  policyStartAt: string;
  claimCaseNo?: number;
}

export interface ClaimStatus {
  additionalData: object;
  description: string;
  durationUnit: number;
  durationValue: number;
  finishType: number;
  flowId: string;
  id: string;
  identifier: string;
  isFinisher: boolean;
  stepId: string;
  stepKey: string;
  stepTitle: string;
  title: string;
}
