import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentOptionDialogData } from './models/payment-option-dialog-data.model';
import { PaymentOptionDialogResult } from './models/payment-option-dialog-result.model';
import { MaxAmountType } from '../../models/payment-option.model';

@Component({
  selector: 'app-payment-option-dialog',
  templateUrl: './payment-option-dialog.component.html',
  styleUrls: ['./payment-option-dialog.component.scss']
})
export class PaymentOptionDialogComponent implements OnInit {

  creditAmount = 0;
  minAmount = 0;
  maxAmount = 0;
  amountIsValid = false;
  maxAmountType: MaxAmountType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: PaymentOptionDialogData,
    private dialogRef: MatDialogRef<PaymentOptionDialogComponent>,
  ) {
    this.creditAmount = this.dialogData.paymentOption.creditItem.creditAmount;
    this.minAmount = this.dialogData.paymentOption.minCreditAmount;
    this.maxAmount = this.dialogData.paymentOption.maxCreditAmount;
    this.maxAmountType = this.dialogData.paymentOption.maxAmountType;
  }

  ngOnInit() {
  }

  amountValueChanged($event) {
    if ($event.numericValue) {
      this.creditAmount = $event.numericValue;
      this.amountIsValid = (this.creditAmount >= this.minAmount && this.creditAmount <= this.maxAmount);
    }
  }

  cancelButton() {
    this.dialogRef.close({
      confirmed: false,
      creditAmount: this.creditAmount,
    } as PaymentOptionDialogResult);
  }

  confirmButton() {
    this.dialogRef.close({
      confirmed: true,
      creditAmount: this.creditAmount,
    } as PaymentOptionDialogResult);
  }
}
