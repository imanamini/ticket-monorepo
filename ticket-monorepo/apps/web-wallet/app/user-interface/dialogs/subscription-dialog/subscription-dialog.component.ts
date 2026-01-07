import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { MessageService } from '../../../core/services/message.service';
import { PAYMENT_TYPES } from '../../../core/constants';
import { OtpPinDialogComponent } from '../otp-pin-dialog/otp-pin-dialog.component';
import { GA_SUBSCRIPTION_ID } from '../../../api/constants/ga-subscription-id';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss']
})
export class SubscriptionDialogComponent {

  walletBalance: number;

  requiredAmount: number;

  pendingRequest = false;

  GA = GA_SUBSCRIPTION_ID.CONTRACT;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      walletBalance: number,
      requiredAmount: number,
    },
    private walletApi: WalletApiService,
    private storage: StorageService,
    private ms: MessageService,
    private matDialogRef: MatDialogRef<OtpPinDialogComponent>
  ) {
    this.walletBalance = this.dialogData.walletBalance;
    this.requiredAmount = this.dialogData.requiredAmount;
  }

  confirm() {
    this.pendingRequest = true;
    this.walletApi.createCashInPayment(
      this.storage.get('ticket'),
      this.requiredAmount, PAYMENT_TYPES.SUBSCRIPTION_CASH_IN
    ).subscribe(response => {
      if (response.payUrl) {
        window.location.replace(response.payUrl);
      }
    }, e => {
      this.ms.showErrorIfExists(e);
      this.pendingRequest = false;
    });
  }

  cancel() {
    this.matDialogRef.close({
      confirmed: false,
      verified: false,
    });
  }

}
