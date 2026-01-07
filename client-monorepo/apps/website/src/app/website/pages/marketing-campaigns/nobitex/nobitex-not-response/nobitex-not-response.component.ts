import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-nobitex-not-response',
  templateUrl: './nobitex-not-response.component.html',
  styleUrls: ['./nobitex-not-response.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, UiIconDirective],
})
export class NobitexNotResponseComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private dialogService: DialogBottomSheetService,
  ) {}

  closeDialog() {
    this.dialogService.close(true);
  }
  back() {
    this.closeDialog();
  }
}
