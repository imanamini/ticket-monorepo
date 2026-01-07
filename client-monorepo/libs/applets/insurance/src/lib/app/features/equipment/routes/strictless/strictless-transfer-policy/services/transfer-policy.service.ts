import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { TransferPolicyShortenModel } from '../../../../api/models/policy/policy-transfer-response.model';
import { PolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { EEIRegisterModel } from '../../../../api/models/EEI-register.model';

@Injectable({
  providedIn: 'root'
})
export class TransferPolicyService {

  transferredPolicyInfo = new BehaviorSubject<TransferPolicyShortenModel>(null);

  constructor(private router: Router,
              private policyApiService: PolicyApiService,
              private messageService: MessageService
  ) {
  }

  setTransferredPolicyInfo(info): void {
    this.transferredPolicyInfo.next(info);
  }

  transferByCodeApi(transferProfile: EEIRegisterModel): void {
    const transferInfo = this.transferredPolicyInfo.getValue();
    this.policyApiService.policyTransferByCode(transferInfo.transferCode, transferProfile).subscribe(res => {
      this.router.navigate(['/dashboard/policy/list'], {
        queryParams: {
          transferPolicy: transferInfo.policyDraftNo,
        }
      }).then();
    }, err => {
      this.messageService.showErrorIfExists(err);
    });

  }

}
