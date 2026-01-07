import { Component, Inject, OnInit } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { MessageService } from '../../../core/services/message.service';
import { SubscriptionContractResponse } from '../../../api/models/subscription-contracts.response';
import { OtpPinDialogComponent } from '../otp-pin-dialog/otp-pin-dialog.component';
import { NumberPersianText, TimePersianUnit } from '../../../wallet/wallet-subscription/wallet-subscription.constants';
import { AnalyticsId } from '../../../api/models/analytics-id';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-contract-dialog',
  templateUrl: './cancel-contract-dialog.component.html',
  styleUrls: ['./cancel-contract-dialog.component.scss']
})
export class CancelContractDialogComponent implements OnInit {

  contractInfo: SubscriptionContractResponse;

  pendingRequest = false;

  timePersianUnit: {};

  numberPersianText: {};

  confirmButtonTitle = 'تایید';

  cardAmountPrefix: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      id: AnalyticsId,
      contractInfo: SubscriptionContractResponse,
      confirmButtonTitle,
      cardAmountPrefix
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
    if (this.dialogData.confirmButtonTitle) {
      this.confirmButtonTitle = this.dialogData.confirmButtonTitle;
    }
  }

  confirm() {
    this.matDialogRef.close(this.contractInfo);
  }

  cancel() {
    this.matDialogRef.close(false);
  }

  getValidityDuration() {
    return (this.numberPersianText[this.contractInfo.validityDuration.count] ||
        this.contractInfo.validityDuration.count) + ' ' +
      this.timePersianUnit[this.contractInfo.validityDuration.timeUnit].persianUnit;
  }

  getPaymentPeriodDuration() {
    return (this.numberPersianText[this.contractInfo.paymentPeriodDuration.count] ||
        this.contractInfo.paymentPeriodDuration.count) + ' ' +
      this.timePersianUnit[this.contractInfo.paymentPeriodDuration.timeUnit].persianUnit;
  }

  getTrialDuration() {
    return this.contractInfo.trialDuration.count + ' ' +
      this.timePersianUnit[this.contractInfo.trialDuration.timeUnit].persianUnit +
      ' دوره آزمایشی';
  }
}
