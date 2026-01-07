import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-credit-hints',
  templateUrl: './ui-dialog-credit-hints.component.html',
  styleUrls: ['./ui-dialog-credit-hints.component.scss'],
  standalone: true,
  imports: [UiIconDirective, NgIf, NgFor, UiButtonComponent, UiIconDirective, NgxIcon],
})
export class UiDialogCreditHintsComponent {
  templateData: any;

  constructor(
    private dialog: DialogBottomSheetService,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData,
  ) {
    this.templateData = dialogData.data ? dialogData.data.templateData : bottomSheetData.data.templateData;
  }

  closeDialog() {
    this.dialog.close();
  }
}
