import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface CreditConfirmBottomSheetData {
  confirmButtonTitle: string;
  rejectButtonTitle: string;
  description: string;
}

@Component({
  selector: 'app-credit-confirm-bottom-sheet',
  templateUrl: './credit-confirm-bottom-sheet.component.html',
  styleUrls: ['./credit-confirm-bottom-sheet.component.scss']
})
export class CreditConfirmBottomSheetComponent implements OnInit {

  description: string;
  confirmButtonTitle: string;
  rejectButtonTitle: string;

  constructor(
    private ref: MatBottomSheetRef<CreditConfirmBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CreditConfirmBottomSheetData,
  ) {
    this.confirmButtonTitle = data.confirmButtonTitle;
    this.rejectButtonTitle = data.rejectButtonTitle;
    this.description = data.description;
  }

  ngOnInit(): void {
  }

  confirm() {
    this.ref.dismiss(true);
  }

  reject() {
    this.ref.dismiss(false);
  }

}
