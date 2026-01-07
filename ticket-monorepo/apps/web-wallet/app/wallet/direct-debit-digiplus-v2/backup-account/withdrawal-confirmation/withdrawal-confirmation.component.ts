import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DirectDebitBank, DirectDebitTicketInfoResponse } from '../../../../api/models/direct-debit.response';
import { WithdrawalConfirmationData } from './withdrawal-confirmation-data';
import {DirectDebitApiV2Service} from "../../../../api/direct-debit-api-v2.service";

@Component({
  selector: 'app-withdrawal-confirmation',
  templateUrl: './withdrawal-confirmation.component.html',
  styleUrls: ['./withdrawal-confirmation.component.scss'],
})
export class WithdrawalConfirmationComponent implements OnInit {

  ticketInfo: DirectDebitTicketInfoResponse = null;

  ticket: string = null;

  feeAmount = null;

  bank: DirectDebitBank;

  loading = true;

  totalWithdrawal = 0;

  constructor(
    private directDebitApiV2Service: DirectDebitApiV2Service,
    @Optional()
    private dialogRef: MatDialogRef<any>,

    @Optional()
    private bottomSheetRef: MatBottomSheetRef<any>,

    @Optional()
    @Inject(MAT_DIALOG_DATA) public dialogData: WithdrawalConfirmationData,

    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: WithdrawalConfirmationData,
  ) {

    const data: WithdrawalConfirmationData = dialogData ? dialogData : bottomSheetData;
    this.ticketInfo = data.ticketInfo;
    this.ticket = data.ticket;
    this.bank = data.bank;
  }

  ngOnInit(): void {
    this.getFee();
  }

  private getFee() {
    this.directDebitApiV2Service.getMaxFeeV2(
      this.ticket,
      1, // this.ticketInfo.maxMonthlyTransactionCount,
      this.ticketInfo.duration.timeUnit,
      1, // this.ticketInfo.duration.count
    ).subscribe(res => {
      this.feeAmount = res.feeAmount;
      this.loading = false;
      this.calculateTotalWithdrawal();
    }, e => {

    });
  }

  private calculateTotalWithdrawal() {
    this.totalWithdrawal = this.ticketInfo.maxDailyTransactionAmount + (this.feeAmount / this.ticketInfo.duration.count);
  }

  confirm(): void {
    if (this.dialogRef) {
      this.dialogRef.close(true);
    }
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss(true);
    }
  }

  reject(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss(false);
    }
  }

}
