import { PolicyModel } from '../../../../../../../equipment/api/models/policy/policy.model';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import {
  UiSpecialDialogComponent
} from '../../../../../../../../components/ui-special-dialog/ui-special-dialog.component';
import {
  PolicyGeneralInfoComponent
} from '../../../../../../../equipment/applets/policy-general-info/policy-general-info.component';
import { Subscription } from 'rxjs';
import { StepperService } from '../../../../../../../../util/stepper.service';
import { PolicyApiService } from '../../../../../../../../data-access/services/policy/policy-api.service';
import { MatDialog } from '@angular/material/dialog';
import {
  NoticeDialogDataModel
} from '../../../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import {
  NoticeDialogComponent
} from '../../../../../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import {
  NoticeDialogOutputModel
} from '../../../../../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';
import { PolicyTransferModel } from '../../../../../../../equipment/api/models/policy/policy-transfer.model';

@Component({
  selector: 'app-transfer-confirm',
  templateUrl: './transfer-confirm.component.html',
  standalone: true,
  imports: [
    UiSpecialDialogComponent,
    PolicyGeneralInfoComponent

  ],
  styleUrls: ['./transfer-confirm.component.scss']
})
export class TransferConfirmComponent implements OnDestroy {

  @Input()
  newInsurerInfo: { transferMobileNo: string };

  @Input()
  policyDetailInfo: PolicyModel;

  @Output()
  throwErrorMessage = new EventEmitter<string>();
  subscriptions = new Subscription();

  constructor(private stepperService: StepperService, private policyApiService: PolicyApiService, private matDialog: MatDialog) {
  }

  confirmTransfer(): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'انتقال بیمه نامه',
      text: 'شماره موبایل وارد شده برای انتقال بیمه نامه قابل تغییر نمی باشد آیا از صحت آن اطمینان دارید؟',
      actionBtnText: 'تایید',
      dismissBtnText: 'بازگشت'
    };
    this.matDialog.open(NoticeDialogComponent, {
      width: '90%',
      panelClass: 'notice-container',
      data: noticeData
    })
      .afterClosed()
      .subscribe({
        next: (data: NoticeDialogOutputModel) => {
          if (data?.isAccepted) {
            this.registerPolicyTransfer();
          }
        }
      });
  }

  registerPolicyTransfer(): void {
    const body: PolicyTransferModel = {
      transferMobileNo: this.newInsurerInfo.transferMobileNo,
      policyDraftNo: this.policyDetailInfo.policyDraftNo
    };
    const subscription = this.policyApiService.policyTransfer(body).subscribe(res => {
      this.stepperService.navigateToStep(3);
    }, err => {
      this.throwErrorMessage.emit(err?.error?.result?.message);
      this.stepperService.navigateToStep(4);
    });

    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
