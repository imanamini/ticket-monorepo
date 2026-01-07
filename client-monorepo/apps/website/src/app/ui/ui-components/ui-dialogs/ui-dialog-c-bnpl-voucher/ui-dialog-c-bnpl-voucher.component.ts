import { Component, Inject } from '@angular/core';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { delay, Observable, of } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-c-bnpl-voucher',
  templateUrl: './ui-dialog-c-bnpl-voucher.component.html',
  styleUrls: ['./ui-dialog-c-bnpl-voucher.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, NgClass, UiButtonComponent, UiIconDirective, NgxIcon],
})
export class UiDialogCBnplVoucherComponent {
  templateData: any = {};
  isCopy = false;
  titleIcon = '';

  constructor(
    private dialog: DialogBottomSheetService,
    @Inject(MAT_DIALOG_DATA)
    public matDialogData: {
      templateData: any;
      titleIcon: string;
    },
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: {
      templateData: any;
      titleIcon: string;
    },
  ) {
    this.templateData = matDialogData.templateData ? matDialogData.templateData : bottomSheetData.templateData;
    this.titleIcon = matDialogData.titleIcon ? matDialogData.titleIcon : bottomSheetData.titleIcon;
  }

  closeDialog(): void {
    this.dialog.close(true);
  }

  copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.isCopy = true;

        this.finishOpening().subscribe({
          next: () => {
            this.isCopy = false;
          },
        });
      });
    }
  }

  private finishOpening(): Observable<string> {
    return of('').pipe(delay(2000));
  }
}
