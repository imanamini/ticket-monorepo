import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'c2c-applet-identity-mismatch-bottom-sheet',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxButtonComponent],
  templateUrl: './identity-mismatch-bottom-sheet.component.html',
  styleUrls: ['./identity-mismatch-bottom-sheet.component.scss'],
})
export class IdentityMismatchBottomSheetComponent {
  data!: { helpUrl: string; title: string; imageId: string; description: string };
  constructor(private bottomSheetService: NgxBottomSheetService) {
    this.data = this.bottomSheetService.data()?.data;
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  guidStudy() {
    this.bottomSheetService.outputData.set({ url: this.data.helpUrl });
    this.bottomSheetService.closeBottomSheet();
  }
}
