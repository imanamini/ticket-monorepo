import { TransferConfirmComponent } from './steps/transfer-confirm/transfer-confirm.component';
import { Component, Inject, OnInit } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { GetNewInsurerInfoComponent } from './steps/get-new-insurer-info/get-new-insurer-info.component';
import {
  UiResultActionComponent
} from '../../../../../../components/ui-result-action/ui-result-action.component';
import { ScreenSizeEnum } from '../../../../../equipment/enums/screen-size.enum';
import { StepperService } from '../../../../../../util/stepper.service';
import { LayoutService } from '../../../../../../data-access/services/layout.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  standalone: true,
  imports: [
    NgSwitch,
    TransferConfirmComponent,
    NgSwitchCase,
    GetNewInsurerInfoComponent,
    UiResultActionComponent
  ],
  styleUrls: ['./transfer-request.component.scss']
})
export class TransferRequestComponent implements OnInit {

  currentStep: number;

  size: ScreenSizeEnum;

  newInsurerInfo: { transferMobileNo: string };

  errorMessage: string;

  constructor(private stepperService: StepperService,
              private layout: LayoutService,
              @Inject(MAT_DIALOG_DATA) public dialogData: { policyDetailInfo },
              @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: { policyDetailInfo },
              private dialogRef: MatDialogRef<TransferRequestComponent>,
              private sheetRef: MatBottomSheetRef<TransferRequestComponent>) {
  }

  ngOnInit(): void {
    this.setScreenSize();
    this.setCurrentStep();
  }

  setScreenSize(): void {
    this.layout.screenSizeChanged.subscribe(res => {
      this.size = res;
    });
  }

  setCurrentStep(): void {
    this.stepperService.getMaxStep(4, 1).registerStepperSource.subscribe(step => {
      this.currentStep = step;
    });
  }

  onClickResultButton(): void {
    if (this.size === 'XS' || this.sheetRef) {
      return this.sheetRef.dismiss();
    }
    this.dialogRef?.close();
  }

}
