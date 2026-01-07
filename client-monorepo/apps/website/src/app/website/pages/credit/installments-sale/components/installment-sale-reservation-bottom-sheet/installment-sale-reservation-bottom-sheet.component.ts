import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-installment-sale-reservation-bottom-sheet',
  templateUrl: './installment-sale-reservation-bottom-sheet.component.html',
  styleUrls: ['./installment-sale-reservation-bottom-sheet.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class InstallmentSaleReservationBottomSheetComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { hours: number },
    private bottomSheetRef: MatBottomSheetRef<InstallmentSaleReservationBottomSheetComponent>,
  ) {}

  closeBottomSheet() {
    this.bottomSheetRef.dismiss();
  }
}
