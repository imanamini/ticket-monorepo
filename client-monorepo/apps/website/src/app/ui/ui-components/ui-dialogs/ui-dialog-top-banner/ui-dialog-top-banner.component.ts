import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgFor, NgIf } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-top-banner',
  templateUrl: './ui-dialog-top-banner.component.html',
  styleUrls: ['./ui-dialog-top-banner.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf, UiButtonComponent, NgxIcon],
})
export class UiDialogTopBannerComponent {
  templateData: any = {};

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      templateData: any;
    },
  ) {
    this.templateData = data.templateData;
  }

  closeDialog(): void {
    this.ref.close(false);
  }
}
