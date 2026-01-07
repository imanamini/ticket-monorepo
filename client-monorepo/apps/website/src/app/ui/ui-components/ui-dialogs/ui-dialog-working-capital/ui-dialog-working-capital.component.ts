import { Component, Inject } from '@angular/core';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-working-capital',
  templateUrl: './ui-dialog-working-capital.component.html',
  styleUrls: ['./ui-dialog-working-capital.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, UiButtonComponent, NgxIcon],
})
export class UiDialogWorkingCapitalComponent {
  templateData: any = {};

  constructor(
    private dialog: DialogBottomSheetService,
    @Inject(MAT_DIALOG_DATA)
    public matDialogData: {
      templateData: any;
      titleIcon: string;
    },
  ) {
    this.templateData = matDialogData.templateData;
  }

  closeDialog(showDocuments: boolean): void {
    this.dialog.close(true);
  }
}
