import { Component, Inject } from '@angular/core';
import { BetaAppTemplate } from '../../../../api/clients/models/templates/beta-app/beta-app-template';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-beta-app-dialog',
  templateUrl: './beta-app-dialog.component.html',
  styleUrls: ['./beta-app-dialog.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, NgxIcon],
})
export class BetaAppDialogComponent {
  templateData: BetaAppTemplate | any = {};

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      templateData: BetaAppTemplate;
    },
  ) {
    this.templateData = data.templateData;
  }

  closeDialog(): void {
    this.ref.close(false);
  }
}
