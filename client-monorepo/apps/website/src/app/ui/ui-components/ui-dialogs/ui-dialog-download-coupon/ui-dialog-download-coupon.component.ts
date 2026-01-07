import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { delay, of, Subscription } from 'rxjs';
import { LayoutService } from '../../../../website/services/layout.service';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgIf, NgClass } from '@angular/common';
import { UiDialogBottomSheetComponent } from '../../ui-dialog-bottom-sheet/ui-dialog-bottom-sheet/ui-dialog-bottom-sheet.component';

@Component({
  selector: 'app-ui-dialog-download',
  templateUrl: './ui-dialog-download-coupon.component.html',
  styleUrls: ['./ui-dialog-download-coupon.component.scss'],
  standalone: true,
  imports: [UiDialogBottomSheetComponent, NgIf, NgClass, UiButtonComponent],
})
export class UiDialogDownloadCouponComponent implements OnInit {
  templateData: any = {};

  isCopy = false;

  subscription: Subscription;

  data: any;

  constructor(
    private layoutService: LayoutService,
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.data = !value ? this.dialogData.templateData : this.sheetData.templateData;
    });
  }

  ngOnInit(): void {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.data = !value ? this.dialogData.templateData : this.sheetData.templateData;
    });
  }

  closeDialog(): void {
    this.ref.close(false);
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          this.isCopy = true;
          of('')
            .pipe(delay(2000))
            .subscribe({
              next: () => {
                this.isCopy = false;
              },
            });
        },
        function (err) {
          console.error('Async: Could not copy text: ', err);
        },
      );
    }
  }
}
