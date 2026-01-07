import { Injectable } from '@angular/core';
import { DamageDocuments } from '../../../../equipment/api/models/damages/damages.model';
import { AddClaimModel } from '../../../../equipment/api/models/claim/claim-models';

@Injectable({
  providedIn: 'root'
})
export class RegisterDamageStateManagementService {

  private claimStateHolder: AddClaimModel = {
    policyDraftNo: 0,
    accidentAt: '',
    story: '',
    selectedCoverIdentifier: '',
    documents: [],
    policyStartAt: '',
    claimCaseNo: 0
  };

  selectCoverage(selectedCoverIdentifier: string): void {
    this.claimStateHolder.selectedCoverIdentifier = selectedCoverIdentifier;
  }

  accidentDetail(accidentAt: string, story: string): void {
    this.claimStateHolder.accidentAt = accidentAt;
    this.claimStateHolder.story = story;
  }

  setPolicyDraftNo(policyDraftNo: number): void {
    this.claimStateHolder.policyDraftNo = policyDraftNo;
  }

  setPolicyStartAt(policyStartAt: string): void {
    this.claimStateHolder.policyStartAt = policyStartAt;
  }

  setClaimCaseNo(claimCaseNo: number): void {
    this.claimStateHolder.claimCaseNo = claimCaseNo;
  }

  updateDocuments(documents: DamageDocuments[]): void {
    this.claimStateHolder.documents = documents;
  }

  getAllInfo(): AddClaimModel {
    return this.claimStateHolder;
  }
}
