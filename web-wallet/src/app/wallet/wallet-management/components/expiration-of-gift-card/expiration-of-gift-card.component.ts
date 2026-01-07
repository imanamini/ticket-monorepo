import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {BadgeAlertInterface} from "../../../new-upg/components/badge-alert/badge-alert.interface";

@Component({
  selector: 'app-expiration-of-gift-card',
  templateUrl: './expiration-of-gift-card.component.html',
  styleUrls: ['./expiration-of-gift-card.component.scss']
})
export class ExpirationOfGiftCardComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetState: BadgeAlertInterface,
    private matBottomSheetRef: MatBottomSheetRef<ExpirationOfGiftCardComponent>) {
  }

  close(): void {
    this.matBottomSheetRef.dismiss();
  }

}
