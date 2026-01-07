import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import {
  EarlySettlementConfirmationFeeDialogComponent
} from '../early-settlement-confirmation-fee-dialog/early-settlement-confirmation-fee-dialog.component';
import { SmartDialog } from '../../../user-interface/services/smart-dialog';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { FeeInitResponse } from '../../../api/clients/early-settlement/response-models/fee-init.response';
import { MessageService } from '../../../core/message.service';
import { ApiErrorStatus } from '../../../api/clients/early-settlement/basic-models/api-error-status';

@Component({
  selector: 'early-settlement-step-confirmation-dialog',
  templateUrl: './early-settlement-step-confirmation-dialog.component.html',
  styleUrls: ['./early-settlement-step-confirmation-dialog.component.scss']
})
export class EarlySettlementStepConfirmationDialogComponent implements OnInit {

  @Input() previewData?: CreditAllocationDetail;
  @Input() amount: number = 0;
  @Input() trackingCode: string = '';
  @Input() fundProviderName: string = '';
  @Input() ruleId: string = '';
  submitting: boolean = false;
  profileDisabled: boolean = false;
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
  @Output() response = new EventEmitter<FeeInitResponse>();

  constructor(
    private smartDialog: SmartDialog,
    private earlySettlementApiService: EarlySettlementApiService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
  }

  submit() {
    if (this.submitting) {
      return;
    }

    this.smartDialog.open(EarlySettlementConfirmationFeeDialogComponent, {}).then(data => {
      if (data && data.confirmed) {
        this.earlySettlementApiService.settlementFeeInit(this.trackingCode, this.amount, this.ruleId).subscribe(response => {
          this.response.emit(response);
          this.nextStep.emit();
        }, error => {
          if (error?.error?.result?.status === ApiErrorStatus.MERCHANT_CREDIT_SETTLEMENT_PROFILE_DISABLED) {
            this.profileDisabled = true;
          } else {
            this.messageService.showErrorIfExists(error);
          }

        });
      }
    });
  }
}
