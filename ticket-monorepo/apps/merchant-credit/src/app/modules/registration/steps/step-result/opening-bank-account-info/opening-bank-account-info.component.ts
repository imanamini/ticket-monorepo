import { Component, Input, OnInit } from '@angular/core';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OpeningBankAccountInfoBottomSheetComponent } from '../opening-bank-account-info-bottom-sheet/opening-bank-account-info-bottom-sheet.component';

@Component({
  selector: 'app-opening-bank-account-info',
  templateUrl: './opening-bank-account-info.component.html',
  styleUrls: ['./opening-bank-account-info.component.scss']
})
export class OpeningBankAccountInfoComponent implements OnInit {

  @Input()
  requiredDocuments: DocumentItem[] = [];
  constructor(
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
  }

  openInfo() {
    this.bottomSheet.open(OpeningBankAccountInfoBottomSheetComponent, {
      panelClass: ['digipay-bottom-sheet', 'no-padding'],
      data: {
        requiredDocuments: this.requiredDocuments
      }
    });
  }
}
