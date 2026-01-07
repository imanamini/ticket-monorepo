import { Component, Input } from '@angular/core';
import { BetaAppTemplate } from '../../../../api/clients/models/templates/beta-app/beta-app-template';
import { BetaAppDialogComponent } from '../beta-app-dialog/beta-app-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-beta-app-features',
  templateUrl: './beta-app-features.component.html',
  styleUrls: ['./beta-app-features.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiButtonComponent],
})
export class BetaAppFeaturesComponent {
  @Input()
  templateData: BetaAppTemplate | any = {};

  constructor(private matDialog: MatDialog) {}

  openBetaAppDialog() {
    this.matDialog.open(BetaAppDialogComponent, {
      data: {
        templateData: this.templateData,
      },
    });
  }
}
