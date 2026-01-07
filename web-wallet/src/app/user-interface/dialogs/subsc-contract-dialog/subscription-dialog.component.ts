import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { MessageService } from '../../../core/services/message.service';
import { SubscriptionContractResponse } from '../../../api/models/subscription-contracts.response';
import { OtpPinDialogComponent } from '../otp-pin-dialog/otp-pin-dialog.component';
import { NumberPersianText, TimePersianUnit } from '../../../wallet/wallet-subscription/wallet-subscription.constants';
import { AnalyticsId } from '../../../api/models/analytics-id';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subsc-contract-dialog.component.html',
  styleUrls: ['./subsc-contract-dialog.component.scss']
})
export class SubscContractDialogComponent implements OnInit {

  contractInfo: SubscriptionContractResponse;

  pendingRequest = false;

  timePersianUnit: {};

  numberPersianText: {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      id: AnalyticsId,
      contractInfo: SubscriptionContractResponse,
    },
    private walletApi: WalletApiService,
    private storage: StorageService,
    private ms: MessageService,
    private matDialogRef: MatDialogRef<OtpPinDialogComponent>
  ) {
    this.contractInfo = this.dialogData.contractInfo;
  }

  ngOnInit() {
    this.timePersianUnit = TimePersianUnit;
    this.numberPersianText = NumberPersianText;
  }

  confirm() {
    this.matDialogRef.close(this.contractInfo.contractId);
  }

  cancel() {
    this.matDialogRef.close(false);
  }

  getValidityDuration() {
    return (NumberPersianText[this.contractInfo.validityDuration.count] ||
        this.contractInfo.validityDuration.count) + ' ' +
      TimePersianUnit[this.contractInfo.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return (NumberPersianText[this.contractInfo.paymentPeriodDuration.count] ||
        this.contractInfo.paymentPeriodDuration.count) + ' ' +
      TimePersianUnit[this.contractInfo.paymentPeriodDuration.timeUnit].persianUnit;
  }

  getTrialDuration() {
    if (this.contractInfo.trialDuration) {
      return this.contractInfo.trialDuration.count + ' ' +
        TimePersianUnit[this.contractInfo.trialDuration.timeUnit].persianUnit +
        ' دوره آزمایشی';
    } else {
      return false;
    }
  }
}
