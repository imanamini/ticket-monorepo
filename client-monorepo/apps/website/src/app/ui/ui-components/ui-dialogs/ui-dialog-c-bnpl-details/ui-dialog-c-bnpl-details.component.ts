import { Component, Inject } from '@angular/core';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { NgFor, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-c-bnpl-details',
  templateUrl: './ui-dialog-c-bnpl-details.component.html',
  styleUrls: ['./ui-dialog-c-bnpl-details.component.scss'],
  standalone: true,
  imports: [NgFor, NgOptimizedImage, UiIconDirective, NgxIcon],
})
export class UiDialogCBnplDetailsComponent {
  templateData: any = {};

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
}
