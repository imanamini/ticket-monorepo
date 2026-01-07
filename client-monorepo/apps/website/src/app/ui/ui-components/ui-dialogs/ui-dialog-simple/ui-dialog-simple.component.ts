import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-simple',
  templateUrl: './ui-dialog-simple.component.html',
  styleUrls: ['./ui-dialog-simple.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, UiButtonComponent, NgxIcon],
})
export class UiDialogSimpleComponent {
  templateData: any = {};

  titleIcon = '';

  hideIcon = false;

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
    this.hideIcon = matDialogData.templateData ? matDialogData.templateData.hideIcon : false;
  }

  closeDialog(): void {
    this.dialog.close(true);
  }
}
