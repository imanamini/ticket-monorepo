import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDialogBtmSheetComponent } from '../../ui-components/ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';

@Component({
  selector: 'pay-club-applet-offline-pay-details-dialog',
  standalone: true,
  imports: [CommonModule, UiDialogBtmSheetComponent],
  templateUrl: './offline-pay-details-dialog.component.html',
  styleUrls: ['./offline-pay-details-dialog.component.scss'],
})
export class OfflinePayDetailsDialogComponent {}
