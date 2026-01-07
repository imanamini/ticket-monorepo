import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { EditAmountResult } from './edit-amount-result.model';

@Component({
  selector: 'app-edit-credit-amount-bottom-sheet',
  templateUrl: './edit-credit-amount-bottom-sheet.component.html',
  styleUrls: ['./edit-credit-amount-bottom-sheet.component.scss']
})
export class EditCreditAmountBottomSheetComponent implements OnInit {

  creditAmount = 0;
  minAmount = 0;
  maxAmount = 0;
  amountIsValid = false;
  maxAmountType: 'balance' | 'purchase';

  constructor(
    private ref: MatBottomSheetRef<EditCreditAmountBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {
    this.creditAmount = this.data.creditAmount;
    this.minAmount = this.data.minAmount;
    this.maxAmount = this.data.maxAmount;
    this.maxAmountType = this.data.maxAmountType;
  }

  ngOnInit() {
  }

  amountValueChanged($event) {
    this.creditAmount = $event;
    this.amountIsValid = this.creditAmount >= this.minAmount && this.creditAmount <= this.maxAmount;
  }

  confirmButton() {
    this.ref.dismiss({
      confirmed: true,
      creditAmount: this.creditAmount,
    } as EditAmountResult);
  }

}
