import { Component, Inject, OnInit } from '@angular/core';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-opening-bank-account-info-bottom-sheet',
  templateUrl: './opening-bank-account-info-bottom-sheet.component.html',
  styleUrls: ['./opening-bank-account-info-bottom-sheet.component.scss']
})
export class OpeningBankAccountInfoBottomSheetComponent implements OnInit {

  requiredDocuments: DocumentItem[] = [];

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {requiredDocuments: DocumentItem[]},
    private matBottomSheetRef: MatBottomSheetRef<OpeningBankAccountInfoBottomSheetComponent>,
  ) {
    this.requiredDocuments = data.requiredDocuments;
  }

  ngOnInit(): void {
  }

  close() {
    this.matBottomSheetRef.dismiss();
  }
}
