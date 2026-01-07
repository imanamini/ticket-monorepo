import { Component, Input } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'subscription-applet-ui-dialog-btm-sheet',
  templateUrl: './ui-dialog-btm-sheet.component.html',
  standalone: true,
  styleUrls: ['./ui-dialog-btm-sheet.component.scss'],
})
export class UiDialogBtmSheetComponent {
  @Input() closeable = false;

  @Input() title = '';

  @Input() image = '';

  @Input() titleRight = false;

  @Input() hasHeader = true;

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  close(): void {
    this.bottomSheetService.closeBottomSheet();
  }
}
