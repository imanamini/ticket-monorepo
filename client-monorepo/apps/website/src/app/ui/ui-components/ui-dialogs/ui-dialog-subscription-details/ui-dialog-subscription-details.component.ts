import { Component, Inject } from '@angular/core';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-subscription-details',
  templateUrl: './ui-dialog-subscription-details.component.html',
  styleUrls: ['./ui-dialog-subscription-details.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, UiIconDirective, NgxIcon],
})
export class UiDialogSubscriptionDetailsComponent {
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
