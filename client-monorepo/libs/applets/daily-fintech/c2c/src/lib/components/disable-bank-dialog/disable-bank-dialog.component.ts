import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'c2c-applet-disable-bank-dialog',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './disable-bank-dialog.component.html',
  styleUrls: ['./disable-bank-dialog.component.scss'],
})
export class DisableBankDialogComponent {
  description;
  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.description = this.bottomSheetService.data()?.data;
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
