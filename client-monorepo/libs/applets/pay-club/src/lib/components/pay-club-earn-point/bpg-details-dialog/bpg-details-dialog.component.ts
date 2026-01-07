import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDialogBtmSheetComponent } from '../../ui-components/ui-dialog-btm-sheet/ui-dialog-btm-sheet.component';

@Component({
  selector: 'pay-club-applet-bpg-details-dialog',
  standalone: true,
  imports: [CommonModule, UiDialogBtmSheetComponent],
  templateUrl: './bpg-details-dialog.component.html',
  styleUrls: ['./bpg-details-dialog.component.scss'],
})
export class BpgDetailsDialogComponent {}
