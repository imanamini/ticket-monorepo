import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EEIRegisterModel } from '../../../../../api/models/EEI-register.model';
import { StepperService } from '../../../../../../../util/stepper.service';
import { ScreenSizeEnum } from '../../../../../enums/screen-size.enum';
import { LayoutService } from '../../../../../../../data-access/services/layout.service';
import { PolicyApiService } from '../../../../../../../data-access/services/policy/policy-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { CardComponent } from '../../../../../../../components/card/card.component';
import {
  ElectronicEquipmentRegisterComponent
} from '../../../../../applets/electronic-equipment-register/electronic-equipment-register.component';
import {
  ChangePolicyOwnerConfirmComponent
} from '../../../../../applets/change-policy-owner-confirm/change-policy-owner-confirm.component';
import {
  UiResultActionComponent
} from '../../../../../../../components/ui-result-action/ui-result-action.component';
import { PolicyModel } from '../../../../../api/models/policy/policy.model';

enum ChangePolicyOwnerEnum {
  registerNewOwner,
  confirm,
  result
}

@Component({
  selector: 'change-policy-owner',
  templateUrl: './change-policy-owner.component.html',
  styleUrls: ['./change-policy-owner.component.scss'],
  providers: [StepperService],
  imports: [
    NgSwitch,
    NgIf,
    NgSwitchCase,
    CardComponent,
    ElectronicEquipmentRegisterComponent,
    ChangePolicyOwnerConfirmComponent,
    UiResultActionComponent,
  ],
  standalone: true
})
export class ChangePolicyOwnerComponent implements OnInit {

  registeredValue: EEIRegisterModel;

  changeStepsEnum = ChangePolicyOwnerEnum;

  currentStepValue: ChangePolicyOwnerEnum = this.changeStepsEnum.registerNewOwner;

  screenSize: ScreenSizeEnum;

  policy: PolicyModel;

  data: {
    policy: PolicyModel,
    hasProfile: boolean
  };

  status: 'SUCCESS' | 'FAILED' = 'SUCCESS';

  describeStatus = {
    title: '',
    description: ''
  };
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: { policy: PolicyModel, hasProfile: boolean },
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: { policy: PolicyModel, hasProfile: boolean },
    private stepper: StepperService,
    private layout: LayoutService,
    private dialogRef: MatDialogRef<any>,
    private sheetRef: MatBottomSheetRef,
    private policyService: PolicyApiService,
    private router: Router
  ) {
    this.screenSize = layout.currentSize;
    this.data = this.screenSize === 'LG' ? this.dialogData : this.sheetData;
    this.policy = this.data.policy;
  }

  ngOnInit(): void {
    this.stepper.getMaxStep(this.changeStepsEnum.result, this.data.hasProfile ? 1 : 0).registerStepperSource.subscribe(step => {
      this.currentStepValue = step;
    });
  }

  close(): void {
    this.screenSize === 'LG' ? this.dialogRef?.close() : this.sheetRef?.dismiss();
  }

  registerSubmitted(regValue: EEIRegisterModel): void {
    this.registeredValue = regValue;
    this.stepper.nextStep();
  }

  transferClaim(newPerson): void {
    this.policyService.policyTransferById(this.policy.policyDraftNo, newPerson).subscribe(res => {
      this.status = 'SUCCESS';
      this.describeStatus = {
        title: ' انتقال با موفقیت انجام شد',
        description: 'در حال انتقال شما به پنل کاربریتان هستیم، شما می‌توانید از طریق پنل کاربری خود اقدام به اعلام خسارت کنید.'
      };
      this.stepper.nextStep();
    }, e => {
      this.status = 'FAILED';
      this.stepper.nextStep();
      this.describeStatus = {
        title: 'عملیات انجام نشد',
        description: e.error.result.message
      };
    });
  }

  redirectUser(): void {
    this.router.navigate(['/'], {relativeTo: this.activatedRoute}).then();
  }
}
