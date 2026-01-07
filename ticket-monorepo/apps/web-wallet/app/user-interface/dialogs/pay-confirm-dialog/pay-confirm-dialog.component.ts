import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletApiService } from '../../../api/wallet-api.service';
import { UserDetail } from '../../../api/models/tac.response';
import { FEATURE_NAMES, FEATURES } from '../../../api/constants';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-pay-confirm-dialog',
  templateUrl: './pay-confirm-dialog.component.html',
  styleUrls: ['./pay-confirm-dialog.component.scss']
})
export class PayConfirmDialogComponent {

  step = 0;

  pin = '';

  callingLoginApi = false;

  pinClearSignal = 0;

  constructor(
    private matDialogRef: MatDialogRef<PayConfirmDialogComponent>,
    private walletApi: WalletApiService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      amount: number,
      protection: 'OTP' | 'PIN',
      userDetail: UserDetail,
    }
  ) {
    this.step = this.dialogData.protection === 'OTP' ? 0 : 1;
  }

  enteredPin(value) {
    this.pin = value;
    if (this.pin.length === 4) {
      this.callLoginApi();
    }
  }

  confirm() {
    switch (this.dialogData.protection) {
      case 'OTP':
        this.matDialogRef.close({
          confirmed: true,
          verified: false,
        });
        break;
      case 'PIN':
        this.callLoginApi();
        break;
    }
  }

  cancel() {
    this.matDialogRef.close({
      confirmed: false,
      verified: false,
    });
  }

  /**
   * Call login API
   */
  private callLoginApi() {
    this.callingLoginApi = true;
    this.walletApi.loginUser(this.dialogData.userDetail.userId, this.pin, [
      FEATURES[FEATURE_NAMES.PAYMENT_WALLET]
    ]).subscribe(response => {
      this.callingLoginApi = false;
      this.matDialogRef.close({
        confirmed: true,
        verified: true
      });
    }, e => {
      this.pinClearSignal++;
      this.callingLoginApi = false;
      this.pin = '';
      this.messageService.showErrorIfExists(e);
    });
  }

}
