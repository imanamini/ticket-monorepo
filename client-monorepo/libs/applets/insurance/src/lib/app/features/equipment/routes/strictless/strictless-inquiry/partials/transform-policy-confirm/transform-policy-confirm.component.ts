import { Component, EventEmitter, inject, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { EEIRegisterModel } from '../../../../../api/models/EEI-register.model';
import { PolicyApiService } from '../../../../../../../data-access/services/policy/policy-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import {
  ChangePolicyOwnerConfirmComponent
} from '../../../../../applets/change-policy-owner-confirm/change-policy-owner-confirm.component';
import { PolicyModel } from '../../../../../api/models/policy/policy.model';

@Component({
  selector: 'transform-policy-confirm',
  templateUrl: './transform-policy-confirm.component.html',
  styleUrls: ['./transform-policy-confirm.component.scss'],
  imports: [ChangePolicyOwnerConfirmComponent],
  standalone: true,
})
export class TransformPolicyConfirmComponent implements OnInit {
  @Output()
  submitted = new EventEmitter();

  newPerson: EEIRegisterModel;

  policy: PolicyModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: { newPerson: EEIRegisterModel; policy: PolicyModel },
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: { newPerson: EEIRegisterModel; policy: PolicyModel },
    private dialogRef: MatDialogRef<any>,
    private sheetRef: MatBottomSheetRef,
    private policyService: PolicyApiService,
    private messageService: MessageService,
    private router: Router,
  ) {
    if (dialogData.policy) {
      this.policy = dialogData.policy;
      this.newPerson = dialogData.newPerson;
    } else {
      this.policy = sheetData.policy;
      this.newPerson = sheetData.newPerson;
    }
  }

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {}

  transferPolicy(newPerson): void {
    this.policyService.policyTransferById(this.policy.policyDraftNo, newPerson).subscribe(
      (res) => {
        this.messageService.showApiSuccess(res);
        this.router.navigate(['/'],{relativeTo: this.activatedRoute}).then();
      },
      (e) => {
        this.messageService.showErrorIfExists(e);
      },
    );
  }

  closeEventCalled(): void {
    if (this.dialogData.policy) {
      this.dialogRef?.close();
    } else {
      this.sheetRef?.dismiss();
    }
  }
}
