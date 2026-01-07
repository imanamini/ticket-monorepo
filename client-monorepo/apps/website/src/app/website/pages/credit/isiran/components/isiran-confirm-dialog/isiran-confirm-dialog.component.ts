import { Component } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiPageTitleBarComponent } from '../../../../../../ui/ui-components/ui-page-title-bar/ui-page-title-bar.component';

@Component({
  selector: 'app-isiran-confirm-dialog',
  templateUrl: './isiran-confirm-dialog.component.html',
  styleUrls: ['./isiran-confirm-dialog.component.scss'],
  standalone: true,
  imports: [UiPageTitleBarComponent, UiButtonComponent],
})
export class IsiranConfirmDialogComponent {
  constructor(private dialog: DialogBottomSheetService) {}

  closeDialog() {
    this.dialog.close(false);
  }

  submit() {
    this.dialog.close(true);
  }
}
