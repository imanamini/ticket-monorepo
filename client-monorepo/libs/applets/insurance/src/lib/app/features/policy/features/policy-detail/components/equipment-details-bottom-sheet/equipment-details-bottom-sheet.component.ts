import { Component, inject } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { TransferRequestComponent } from '../transfer-request/transfer-request.component';

@Component({
  selector: 'equipment-details-bottom-sheet',
  standalone: true,
  imports: [
    NgxIcon
  ],
  templateUrl: './equipment-details-bottom-sheet.component.html',
  styleUrl: './equipment-details-bottom-sheet.component.scss'
})
export class EquipmentDetailsBottomSheetComponent {
  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  private bottomSheetService = inject(BottomSheetService);

  downloadReceipt(): void {
    window.open(this.bottomSheetData.data.invoiceUrl, '_blank');
  }

  transferOwnership(): void {
    this.bottomSheetService.open(TransferRequestComponent, {
      name: 'TransferRequestComponent',
      policyDetailInfo: this.bottomSheetData.data
    });
  }
}
