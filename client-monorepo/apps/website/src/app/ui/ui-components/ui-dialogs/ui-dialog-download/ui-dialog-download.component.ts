import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiDownloadLinksComponent } from '../../ui-download/ui-download-links/ui-download-links.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-download',
  templateUrl: './ui-dialog-download.component.html',
  styleUrls: ['./ui-dialog-download.component.scss'],
  standalone: true,
  imports: [UiDownloadLinksComponent, NgxIcon],
})
export class UiDialogDownloadComponent {
  templateData: any = {};

  downloadSectionData: any = {};

  isCopy = false;

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      templateData: any;
    },
  ) {
    this.downloadSectionData = data.templateData;
  }

  closeDialog(): void {
    this.ref.close(false);
  }
}
