import { Component, Inject } from '@angular/core';
import { WalletApiService } from '../../../api/wallet-api.service';
import { StorageService } from '../../../core/services/storage.service';
import { MessageService } from '../../../core/services/message.service';
import { PAYMENT_TYPES } from '../../../core/constants';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-in-amount-dialog',
  templateUrl: './cash-in-amount-dialog.component.html',
  styleUrls: ['./cash-in-amount-dialog.component.scss']
})
export class CashInAmountDialogComponent {

  amount: number;

  pendingRequest = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      minAmount: number,
      maxAmount: number,
      defaultValue: number,
    },
    private walletApi: WalletApiService,
    private storage: StorageService,
    private ms: MessageService,
  ) {
  }

  confirm() {
    this.pendingRequest = true;
    this.walletApi.createCashInPayment(this.storage.get('ticket'), this.amount, PAYMENT_TYPES.PURCHASE_CASH_IN).subscribe(response => {
      if (response.payUrl) {
        window.location.replace(response.payUrl);
      }
    }, e => {
      this.ms.showErrorIfExists(e);
      this.pendingRequest = false;
    });
  }

  cashInAmountChanged($event) {
    if ($event.numericValue) {
      this.amount = $event.numericValue;
    } else {
      this.amount = null;
    }
  }
}
