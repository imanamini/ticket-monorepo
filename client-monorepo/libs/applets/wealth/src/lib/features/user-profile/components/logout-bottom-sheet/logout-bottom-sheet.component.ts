import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'app-logout-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './logout-bottom-sheet.component.html',
  styleUrl: './logout-bottom-sheet.component.scss',
})
export class LogoutBottomSheetComponent {
  private bottomSheet = inject(NgxBottomSheetService);

  onClose(confirm: boolean) {
    this.bottomSheet.outputData.set(confirm);
    this.bottomSheet.closeBottomSheet();
  }
}
